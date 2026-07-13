// src/components/CollapsibleChildren.js
//
// Wraps any children in a height + opacity animation that transitions
// smoothly between collapsed (height 0, invisible) and expanded (natural
// height, fully visible) whenever `isOpen` changes.
//
// The hidden clone stays mounted permanently so that onLayout fires
// whenever the natural height changes (e.g. nested CollapsibleChildren
// opening/closing), keeping naturalHeight always current.

import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const DURATION = 220;
const EASING = Easing.inOut(Easing.ease);

export default function CollapsibleChildren({ isOpen, children }) {
  const naturalHeight = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(isOpen ? naturalHeight.value : 0, { duration: DURATION, easing: EASING }),
    opacity: withTiming(isOpen ? 1 : 0, { duration: DURATION, easing: EASING }),
    overflow: 'hidden',
  }));

  const onMeasure = (e) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) naturalHeight.value = h;
  };

  return (
    <>
      <View
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        onLayout={onMeasure}
      >
        {children}
      </View>

      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </>
  );
}