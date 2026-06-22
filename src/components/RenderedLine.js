// src/components/RenderedLine.js
//
// One row in the editable preview pane.
//   - isFocused=true  → editable raw-text TextInput (auto-sized, no scroll)
//   - isFocused=false → rendered markdown output, wrapped in Pressable so
//                       tapping it focuses it via onFocus callback

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { parseBlocks } from '../features/notes/markdown';
import { previewStyles } from '../styles/preview';
import { editorStyles } from '../styles/editor';
import InlineText from './InlineText';

function CommittedLine({ text }) {
  const [block] = parseBlocks(text);
  if (!block) return null;

  switch (block.type) {
    case 'h1':
      return <InlineText text={block.text} style={previewStyles.h1} />;
    case 'h2':
      return <InlineText text={block.text} style={previewStyles.h2} />;
    case 'h3':
      return <InlineText text={block.text} style={previewStyles.h3} />;
    case 'quote':
      return (
        <View style={previewStyles.quoteBlock}>
          <InlineText text={block.text} style={previewStyles.quoteText} />
        </View>
      );
    case 'code':
      return (
        <View style={previewStyles.codeBlock}>
          <Text style={previewStyles.codeBlockText}>{block.text}</Text>
        </View>
      );
    case 'li':
      return (
        <View style={previewStyles.listItem}>
          <Text style={previewStyles.bullet}>{'\u2022'}</Text>
          <InlineText text={block.text} style={previewStyles.listItemText} />
        </View>
      );
    case 'hr':
      return <View style={previewStyles.hr} />;
    case 'blank':
      return <View style={previewStyles.blankSpace} />;
    case 'p':
    default:
      return <InlineText text={block.text} style={previewStyles.paragraph} />;
  }
}

export default function RenderedLine({
  line,
  isFocused,
  onChangeText,
  onEnter,
  onDeleteEmptyLine,
  onFocus,
  onArrowUp,
  onArrowDown,
  inputRef,
}) {
  const [inputHeight, setInputHeight] = useState(22);

  const handleKeyPress = (e) => {
    const key = e.nativeEvent.key;
    if (key === 'Enter') {
      onEnter();
      return;
    }
    if (key === 'Backspace' && line.text === '') {
      onDeleteEmptyLine();
      return;
    }
    if (key === 'ArrowUp') {
      onArrowUp?.();
      return;
    }
    if (key === 'ArrowDown') {
      onArrowDown?.();
    }
  };

  if (isFocused) {
    return (
      <TextInput
        ref={inputRef}
        style={[editorStyles.activeLineInput, { height: inputHeight }]}
        value={line.text}
        onChangeText={onChangeText}
        onKeyPress={handleKeyPress}
        onFocus={onFocus}
        onContentSizeChange={(e) =>
          setInputHeight(e.nativeEvent.contentSize.height)
        }
        blurOnSubmit={false}
        autoCapitalize="none"
        autoCorrect={false}
        multiline={true}
        scrollEnabled={false}
      />
    );
  }

  return (
    <Pressable onPress={onFocus}>
      <CommittedLine text={line.text} />
    </Pressable>
  );
}