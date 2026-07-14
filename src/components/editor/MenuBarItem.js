// src/components/editor/MenuBarItem.js
//
// A single hoverable text label in the editor menu bar.
// Opens a dropdown on hover via the shared menu primitives.

import React, { useState, useRef, useCallback } from 'react';
import MenuTrigger from '../menu/MenuTrigger';
import Dropdown from '../menu/Dropdown';
import DropdownOption from '../menu/DropdownOption';

export default function MenuBarItem({ label, options }) {
  const [anchor, setAnchor] = useState(null);
  const triggerRef = useRef(null);

  const open = anchor !== null;

  const handleOpen = useCallback((coords) => setAnchor(coords), []);
  const handleClose = useCallback(() => setAnchor(null), []);

  return (
    <>
      <MenuTrigger
        label={label}
        active={open}
        onOpen={handleOpen}
        onClose={handleClose}
        triggerRef={triggerRef}
      />
      <Dropdown
        visible={open}
        anchor={anchor}
        onClose={handleClose}
        align="left"
      >
        {options.map((opt) => (
          <DropdownOption
            key={opt.label}
            label={opt.label}
            onPress={() => {
              handleClose();
              opt.onPress?.();
            }}
          />
        ))}
      </Dropdown>
    </>
  );
}