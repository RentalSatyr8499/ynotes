// src/components/EditorPane.js
//
// Left-hand pane: a plain TextInput holding raw markdown/plaintext.

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { screenStyles } from '../../styles/screen';
import { editorStyles } from '../../styles/editor';
import InsertMenu from './InsertMenu';

export default function EditorPane({ value, onChangeText, onFocus, isActive, onInsert, style }) {
  return (
    <View style={[style, { position: 'relative' }]}>
      <Text style={screenStyles.paneLabel}>Editor</Text>
      <InsertMenu isActive={isActive} onInsert={onInsert} />
      <TextInput
        nativeID="editor-input"
        style={editorStyles.input}
        value={value}
        onChangeText={onChangeText}
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Start typing markdown..."
        textAlignVertical="top"
        onFocus={onFocus}
      />
    </View>
  );
}