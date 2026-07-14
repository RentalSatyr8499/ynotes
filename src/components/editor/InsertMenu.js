// src/components/editor/InsertMenu.js
//
// A floating + button that opens an insert-syntax dropdown.
// Appears only when the parent pane is active (focused).

import React, { useState, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import FloatingButton from '../menu/FloatingButton';
import Dropdown from '../menu/Dropdown';
import DropdownOption from '../menu/DropdownOption';

const INSERT_OPTIONS = [
  { label: 'Heading',     syntax: '## '        },
  { label: 'Image',       syntax: '![alt](url)'},
  { label: 'Inline code', syntax: '`code`'     },
  { label: 'Code block',  syntax: '```\n\n```' },
  { label: 'Bold',        syntax: '**text**'   },
  { label: 'Italic',      syntax: '_text_'     },
  { label: 'Link',        syntax: '[text](url)'},
];

export default function InsertMenu({ isActive, onInsert }) {
  const [anchor, setAnchor] = useState(null);
  const triggerRef = useRef(null);

  const open = anchor !== null;

  const handlePress = useCallback(() => {
    if (open) {
      setAnchor(null);
      return;
    }
    triggerRef.current?.measure?.((x, y, width, height, pageX, pageY) => {
      setAnchor({ x: pageX, y: pageY, width, height });
    });
  }, [open]);

  const handleClose = useCallback(() => setAnchor(null), []);

  const handleSelect = useCallback((syntax) => {
    handleClose();
    onInsert?.(syntax);
  }, [handleClose, onInsert]);

  if (!isActive) return null;

  return (
    <>
      <FloatingButton
        icon={require('../../assets/icons/plus.png')}
        active={open}
        onPress={handlePress}
        triggerRef={triggerRef}
      />
      <Dropdown
        visible={open}
        anchor={anchor}
        onClose={handleClose}
        align="right"
      >
        {INSERT_OPTIONS.map(({ label, syntax }) => (
          <DropdownOption
            key={label}
            label={label}
            onPress={() => handleSelect(syntax)}
          />
        ))}
      </Dropdown>
    </>
  );
}