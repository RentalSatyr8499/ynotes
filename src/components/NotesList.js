import { buildPath } from "../features/fileBrowser/tree";

export function NotesList({ items, openPaths, onToggleFolder, onPressNote, depth = 0, styles, parentPath = '', onMalformed }) {
  const rows = [];

  for (const item of items) {
    const path = buildPath(parentPath, item.name);
    const isOpen = !!openPaths[path];

    rows.push(
      <NotesRow key={path} item={item} depth={depth} isOpen={isOpen}
        onPress={() => item.type === 'folder' ? onToggleFolder(path) : onPressNote(item)}
        styles={styles}
      />
    );

    if (item.type === 'folder') {
      const children = parseLevel(item.subtree, onMalformed);
      rows.push(
        <CollapsibleChildren key={`${path}-children`} isOpen={isOpen} debugLabel={path}>
          <NotesList
            items={children}
            openPaths={openPaths}
            onToggleFolder={onToggleFolder}
            onPressNote={onPressNote}
            depth={depth + 1}
            parentPath={path}
            styles={styles}
            onMalformed={onMalformed}
          />
        </CollapsibleChildren>
      );
    }
  }

  return <>{rows}</>;
}