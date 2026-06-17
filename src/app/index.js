import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import useNote from '../hooks/useNote';
import EditorPane from '../components/EditorPane';
import PreviewPane from '../components/PreviewPane';
import { noteScreenStyles } from '../styles/notes';

export default function HomeScreen() {
  const [note, setNote] = useNote();
  const { width } = useWindowDimensions();
  const isNarrow = width < 700;

  return (
    <View style={noteScreenStyles.container}>
      <View style={[noteScreenStyles.panes, isNarrow && noteScreenStyles.panesStacked]}>
        <EditorPane
          value={note}
          onChangeText={setNote}
          style={[
            noteScreenStyles.pane,
            isNarrow ? noteScreenStyles.paneStacked : noteScreenStyles.paneLeft,
          ]}
        />
        <PreviewPane
          source={note}
          style={[
            noteScreenStyles.pane,
            isNarrow ? noteScreenStyles.paneStacked : noteScreenStyles.paneRight,
          ]}
        />
      </View>
    </View>
  );
}