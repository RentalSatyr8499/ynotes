import React, { useCallback, useEffect } from 'react';
import { View, useWindowDimensions, Platform } from 'react-native';
import useNote from '../hooks/useNote';
import useLineEditor from '../hooks/useLineEditor';
import EditorPane from '../components/EditorPane';
import EditablePreviewPane from '../components/EditablePreviewPane';
import { screenStyles } from '../styles/screen';

// Removes the browser's default blue focus ring from all textareas/inputs
// on web. React Native style properties can't reach this — it requires a
// real CSS rule injected into the document.
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

  // useLineEditor is the source of truth while typing in the right pane;
  // every line-level change calls setNote so the left (plaintext) pane
  // mirrors it live.
  const lineEditor = useLineEditor(note, setNote);

  // When the note changes from *outside* the right pane (i.e. the user
  // typed directly into the left plaintext pane), re-derive the line list
  // so the right pane catches up. useLineEditor ignores this call if the
  // text matches what it last emitted itself, so typing in the right pane
  // doesn't cause redundant rebuilds.
  useEffect(() => {
    lineEditor.syncFromExternalText(note);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  const handlePlaintextChange = useCallback(
    (text) => {
      setNote(text);
    },
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
          onChangeActiveLineText={lineEditor.onChangeActiveLineText}
          onCommitActiveLine={lineEditor.onCommitActiveLine}
          onDeletePrecedingCommittedLine={lineEditor.onDeletePrecedingCommittedLine}
          style={[
            screenStyles.pane,
            isNarrow ? screenStyles.paneStacked : screenStyles.paneRight,
          ]}
        />
      </View>
    </View>
  );
}