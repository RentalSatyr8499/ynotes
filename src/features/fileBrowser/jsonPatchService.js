// src/features/fileBrowser/jsonPatchService.js
//
// Pure RFC 6902 JSON Patch implementation.
// No Drive / Docs dependencies — operates only on plain JS objects.

// Resolves a RFC 6902 pointer string (e.g. "/a/b/c") into an array of keys.
// Handles the spec's escape sequences: ~1 → "/", ~0 → "~".
// Throws if the pointer is not absolute (i.e. doesn't start with "/") unless
// it's the root pointer "".
function parsePointer(pointer) {
  if (pointer === '') return []; // root
  if (!pointer.startsWith('/')) {
    throw new Error(`Invalid JSON Pointer: "${pointer}" — must start with "/"`);
  }
  return pointer
    .slice(1)
    .split('/')
    .map(tok => tok.replace(/~1/g, '/').replace(/~0/g, '~'));
}

// Walks `obj` along `keys`, returning { parent, key, exists } so callers can
// read or mutate the target. Throws a descriptive error for illegal paths.
function resolvePath(obj, keys, op) {
  if (keys.length === 0) return { parent: null, key: null, target: obj, exists: true };

  let node = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (node === null || typeof node !== 'object') {
      throw new Error(
        `JSON Patch "${op}" failed: path segment "${k}" is not traversable (got ${JSON.stringify(node)})`
      );
    }
    if (Array.isArray(node)) {
      const idx = k === '-' ? node.length : Number(k);
      if (!Number.isInteger(idx) || idx < 0 || idx >= node.length) {
        throw new Error(
          `JSON Patch "${op}" failed: array index "${k}" is out of bounds (length ${node.length})`
        );
      }
      node = node[idx];
    } else {
      if (!(k in node)) {
        throw new Error(
          `JSON Patch "${op}" failed: key "${k}" does not exist at this level`
        );
      }
      node = node[k];
    }
  }

  const lastKey = keys[keys.length - 1];
  const exists = Array.isArray(node)
    ? lastKey === '-' || (Number.isInteger(Number(lastKey)) && Number(lastKey) < node.length)
    : lastKey in (node ?? {});

  return { parent: node, key: lastKey, exists };
}

// Applies a single RFC 6902 operation to `doc` (mutates in place).
// Supports: add, remove, replace, move, copy, test.
function applyOperation(doc, operation) {
  const { op, path, from, value } = operation;

  if (!op) throw new Error('JSON Patch operation is missing "op"');
  if (path === undefined) throw new Error('JSON Patch operation is missing "path"');

  const keys = parsePointer(path);

  switch (op) {
    case 'add': {
      if (keys.length === 0) throw new Error('JSON Patch "add" cannot target the root');
      const { parent, key } = resolvePath(doc, keys, op);
      if (Array.isArray(parent)) {
        const idx = key === '-' ? parent.length : Number(key);
        if (!Number.isInteger(idx) || idx < 0 || idx > parent.length) {
          throw new Error(`JSON Patch "add" index "${key}" is out of bounds`);
        }
        parent.splice(idx, 0, value);
      } else {
        parent[key] = value;
      }
      break;
    }

    case 'remove': {
      if (keys.length === 0) throw new Error('JSON Patch "remove" cannot target the root');
      const { parent, key, exists } = resolvePath(doc, keys, op);
      if (!exists) throw new Error(`JSON Patch "remove" failed: path "${path}" does not exist`);
      if (Array.isArray(parent)) {
        parent.splice(Number(key), 1);
      } else {
        delete parent[key];
      }
      break;
    }

    case 'replace': {
      if (keys.length === 0) throw new Error('JSON Patch "replace" cannot target the root');
      const { parent, key, exists } = resolvePath(doc, keys, op);
      if (!exists) throw new Error(`JSON Patch "replace" failed: path "${path}" does not exist`);
      if (Array.isArray(parent)) {
        parent[Number(key)] = value;
      } else {
        parent[key] = value;
      }
      break;
    }

    case 'move': {
      if (!from) throw new Error('JSON Patch "move" is missing "from"');
      const fromKeys = parsePointer(from);
      const { parent: fromParent, key: fromKey, exists } = resolvePath(doc, fromKeys, op);
      if (!exists) throw new Error(`JSON Patch "move" failed: "from" path "${from}" does not exist`);
      const moved = Array.isArray(fromParent) ? fromParent[Number(fromKey)] : fromParent[fromKey];
      applyOperation(doc, { op: 'remove', path: from });
      applyOperation(doc, { op: 'add', path, value: moved });
      break;
    }

    case 'copy': {
      if (!from) throw new Error('JSON Patch "copy" is missing "from"');
      const fromKeys = parsePointer(from);
      const { parent: fromParent, key: fromKey, exists } = resolvePath(doc, fromKeys, op);
      if (!exists) throw new Error(`JSON Patch "copy" failed: "from" path "${from}" does not exist`);
      const copied = Array.isArray(fromParent) ? fromParent[Number(fromKey)] : fromParent[fromKey];
      applyOperation(doc, { op: 'add', path, value: structuredClone(copied) });
      break;
    }

    case 'test': {
      const { parent, key, exists } = resolvePath(doc, keys, op);
      if (!exists) throw new Error(`JSON Patch "test" failed: path "${path}" does not exist`);
      const actual = keys.length === 0 ? doc : (Array.isArray(parent) ? parent[Number(key)] : parent[key]);
      if (JSON.stringify(actual) !== JSON.stringify(value)) {
        throw new Error(
          `JSON Patch "test" failed: expected ${JSON.stringify(value)}, got ${JSON.stringify(actual)}`
        );
      }
      break;
    }

    default:
      throw new Error(`JSON Patch: unknown op "${op}"`);
  }
}

// Applies an array of RFC 6902 operations to a deep clone of `doc`.
// All operations are validated and applied atomically — if any throws,
// the original object is left unchanged and the error propagates.
// Returns the patched object.
export function applyPatch(doc, operations) {
  if (!Array.isArray(operations) || operations.length === 0) {
    throw new Error('applyPatch: operations must be a non-empty array');
  }
  const clone = structuredClone(doc);
  for (const operation of operations) {
    applyOperation(clone, operation);
  }
  return clone;
}