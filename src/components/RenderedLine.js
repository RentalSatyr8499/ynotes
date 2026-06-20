// src/components/RenderedLine.js
//
// One row in the editable preview pane.
//   - If committed: render it through the same block/inline parser used
//     by the read-only PreviewPane, locked (not editable).
//   - If active: a plain TextInput showing raw markdown text, editable.
//
// Deliberately reuses parseBlocks/parseInline rather than re-implementing
// rendering logic, so the two preview surfaces (read-only PreviewPane and
// this editable one) can never visually drift apart.

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { parseBlocks } from '../features/notes/markdown';
import { previewStyles } from '../styles/preview';
import { editorStyles } from '../styles/editor';
import InlineText from './InlineText';

// Renders a single committed line's text as a styled block. A line of raw
// markdown maps to exactly one block from parseBlocks (block parsing is
// line-based), so we just take the first result.
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
  isActive,
  onChangeText,
  onSubmitEditing,
  onKeyPress,
  inputRef,
}) {
  if (!isActive) {
    return <CommittedLine text={line.text} />;
  }

  return (
    <TextInput
      ref={inputRef}
      style={editorStyles.activeLineInput}
      value={line.text}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onKeyPress={onKeyPress}
      blurOnSubmit={false}
      autoCapitalize="none"
      autoCorrect={false}
      placeholder="Type markdown, press Enter to render..."
      multiline={false}
    />
  );
}