import React, { useCallback, useEffect } from 'react';
import { View, useWindowDimensions, Platform } from 'react-native';
import useNote from '../hooks/useNote';
import useLineEditor from '../hooks/useLineEditor';
import EditorPane from '../components/EditorPane';
import EditablePreviewPane from '../components/EditablePreviewPane';
import { screenStyles } from '../styles/screen';

function useRemoveWebFocusRing() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const style = document.createElement('style');
    style.textContent = 'textarea:focus, input:focus { outline: none; }';
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
}

export default function HomeScreen() {
  useRemoveWebFocusRing();
  const [note, setNote] = useNote();
  const { width } = useWindowDimensions();
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

  return (
    <View style={screenStyles.container}>
      <View style={[screenStyles.panes, isNarrow && screenStyles.panesStacked]}>
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
          style={[
            screenStyles.pane,
            isNarrow ? screenStyles.paneStacked : screenStyles.paneRight,
          ]}
        />
      </View>
    </View>
  );
}