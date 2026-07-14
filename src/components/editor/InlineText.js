// src/components/InlineText.js
//
// Renders a single line of text with inline markdown formatting
// (bold/italic/code/links) applied as nested <Text> spans.

import React, { useMemo } from 'react';
import { Text } from 'react-native';
import { parseInline } from '../../features/notes/markdown';
import { previewStyles } from '../../styles/preview';

export default function InlineText({ text, style }) {
  const spans = useMemo(() => parseInline(text), [text]);

  return (
    <Text style={style}>
      {spans.map((span, i) => (
        <Text
          key={i}
          style={[
            span.bold && previewStyles.bold,
            span.italic && previewStyles.italic,
            span.code && previewStyles.inlineCode,
            span.link && previewStyles.link,
          ]}
        >
          {span.text}
        </Text>
      ))}
    </Text>
  );
}