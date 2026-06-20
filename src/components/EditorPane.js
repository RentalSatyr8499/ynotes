// src/components/EditorPane.js
//
// Left-hand pane: a plain TextInput holding raw markdown/plaintext.

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { screenStyles } from '../styles/screen';
import { editorStyles } from '../styles/editor';

export default function EditorPane({ value, onChangeText, style }) {
  return (
    <View style={style}>
      <Text style={screenStyles.paneLabel}>Editor</Text>
      <TextInput
        style={editorStyles.input}
        value={value}
        onChangeText={onChangeText}
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Start typing markdown..."
        textAlignVertical="top"
      />
    </View>
  );
}