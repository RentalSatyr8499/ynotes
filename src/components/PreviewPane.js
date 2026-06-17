// src/components/PreviewPane.js
//
// Right-hand pane: takes raw note text, parses it into markdown blocks,
// and renders each block with the appropriate styling.

import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { parseBlocks } from '../features/notes/Markdown';
import { noteScreenStyles, previewStyles } from '../styles/notes';
import InlineText from './InlineText';

export default function PreviewPane({ source, style }) {
  const blocks = useMemo(() => parseBlocks(source), [source]);

  return (
    <View style={style}>
      <Text style={noteScreenStyles.paneLabel}>Preview</Text>
      <ScrollView style={previewStyles.scroll} contentContainerStyle={previewStyles.content}>
        {blocks.map((block, i) => {
          switch (block.type) {
            case 'h1':
              return <InlineText key={i} text={block.text} style={previewStyles.h1} />;
            case 'h2':
              return <InlineText key={i} text={block.text} style={previewStyles.h2} />;
            case 'h3':
              return <InlineText key={i} text={block.text} style={previewStyles.h3} />;
            case 'quote':
              return (
                <View key={i} style={previewStyles.quoteBlock}>
                  <InlineText text={block.text} style={previewStyles.quoteText} />
                </View>
              );
            case 'code':
              return (
                <View key={i} style={previewStyles.codeBlock}>
                  <Text style={previewStyles.codeBlockText}>{block.text}</Text>
                </View>
              );
            case 'li':
              return (
                <View key={i} style={previewStyles.listItem}>
                  <Text style={previewStyles.bullet}>{'\u2022'}</Text>
                  <InlineText text={block.text} style={previewStyles.listItemText} />
                </View>
              );
            case 'hr':
              return <View key={i} style={previewStyles.hr} />;
            case 'blank':
              return <View key={i} style={previewStyles.blankSpace} />;
            case 'p':
            default:
              return <InlineText key={i} text={block.text} style={previewStyles.paragraph} />;
          }
        })}
      </ScrollView>
    </View>
  );
}