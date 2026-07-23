// src/app/editor.js

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, useWindowDimensions, Platform } from 'react-native';
import useNote from '../hooks/useNote';
import LoadingAnimation from '../components/LoadingAnimation';
import useLineEditor from '../hooks/useLineEditor';
import EditorPane from '../components/editor/EditorPane';
import EditablePreviewPane from '../components/editor/EditablePreviewPane';
import EditorHeader from '../components/editor/EditorHeader';
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

const PANE = { NONE: null, EDITOR: 'editor', PREVIEW: 'preview' };

export default function EditorScreen() {
  useWebStyles();
  const [note, setNote, { loading, error, title, syncStatus }] = useNote();
  const { width, height } = useWindowDimensions();
  const isNarrow = width < 700;

  const lineEditor = useLineEditor(note, setNote);
  const [activePane, setActivePane] = useState(PANE.NONE);

  useEffect(() => {
    lineEditor.syncFromExternalText(note);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  const handlePlaintextChange = useCallback(
    (text) => { setNote(text); },
    [setNote]
  );

  const handleInsert = useCallback((syntax) => {
    if (activePane === PANE.EDITOR) {
      setNote((prev) => prev + syntax);
    } else if (activePane === PANE.PREVIEW) {
      lineEditor.onChangeLineText(lineEditor.focusedLineId, syntax);
    }
  }, [activePane, setNote, lineEditor]);

  const handleFileAction = useCallback((action) => {
    // Wire up to navigation/backend when ready
    console.log('File action:', action);
  }, []);

  const horizontalMargin = isNarrow ? 0 : width * 0.1;
  const verticalMargin   = height * 0.05;

  if (loading) return (
    <View style={[screenStyles.container, screenStyles.centered]}>
      <LoadingAnimation />
    </View>
  );

  if (error) return (
    <View style={[screenStyles.container, screenStyles.centered]}>
      <Text>Failed to load note: {error}</Text>
    </View>
  );

  return (
    <View style={screenStyles.container}>
      <EditorHeader
        title={title}
        onFileAction={handleFileAction}
        syncStatus={syncStatus}
      />
      <View style={[
        screenStyles.panes,
        isNarrow ? screenStyles.panesStacked : null,
        {
          marginHorizontal: horizontalMargin,
          marginVertical:   verticalMargin,
        },
      ]}>
        <EditorPane
          value={note}
          onChangeText={handlePlaintextChange}
          onFocus={() => setActivePane(PANE.EDITOR)}
          isActive={activePane === PANE.EDITOR}
          onInsert={handleInsert}
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
          onLineFocus={(id) => {
            lineEditor.onLineFocus(id);
            setActivePane(PANE.PREVIEW);
          }}
          onArrowUp={lineEditor.onArrowUp}
          onArrowDown={lineEditor.onArrowDown}
          isActive={activePane === PANE.PREVIEW}
          onInsert={handleInsert}
          style={[
            screenStyles.pane,
            isNarrow ? screenStyles.paneStacked : screenStyles.paneRight,
          ]}
        />
      </View>
    </View>
  );
}