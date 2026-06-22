import React, { useCallback, useEffect } from 'react';
import { View, useWindowDimensions, Platform } from 'react-native';
import useNote from '../hooks/useNote';
import useLineEditor from '../hooks/useLineEditor';
import EditorPane from '../components/EditorPane';
import EditablePreviewPane from '../components/EditablePreviewPane';
import { screenStyles } from '../styles/screen';

function useWebStyles() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const style = document.createElement('style');
    style.textContent = `
      textarea:focus, input:focus { outline: none; }
      #editor-input { caret-color: #1a1a1a; caret-shape: block; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
}

export default function HomeScreen() {
  useWebStyles();
  const [note, setNote] = useNote();
  const { width, height } = useWindowDimensions();
  const isNarrow = width < 700;

  const lineEditor = useLineEditor(note, setNote);

  useEffect(() => {
    lineEditor.syncFromExternalText(note);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  const handlePlaintextChange = useCallback(
    (text) => { setNote(text); },
    [setNote]
  );

  // 10% margin on each side means the pane area is 80% of screen width.
  // On narrow screens we skip the horizontal margin so panes don't get
  // too cramped when stacked vertically.
  const horizontalMargin = isNarrow ? 0 : width * 0.1;
  const verticalMargin = height * 0.05;

  return (
    <View style={screenStyles.container}>
      <View style={[
        screenStyles.panes,
        isNarrow ? screenStyles.panesStacked : null,
        {
          marginHorizontal: horizontalMargin,
          marginVertical: verticalMargin,
        },
      ]}>
        <EditorPane
          value={note}
          onChangeText={handlePlaintextChange}
          style={[
            screenStyles.pane,
            isNarrow ? screenStyles.paneStacked : screenStyles.paneLeft,
          ]}
        />
        <EditablePreviewPane
          lines={lineEditor.lines}
          focusedLineId={lineEditor.focusedLineId}
          onChangeLineText={lineEditor.onChangeLineText}
          onEnter={lineEditor.onEnter}
          onDeleteEmptyLine={lineEditor.onDeleteEmptyLine}
          onLineFocus={lineEditor.onLineFocus}
          onArrowUp={lineEditor.onArrowUp}
          onArrowDown={lineEditor.onArrowDown}
          style={[
            screenStyles.pane,
            isNarrow ? screenStyles.paneStacked : screenStyles.paneRight,
          ]}
        />
      </View>
    </View>
  );
}