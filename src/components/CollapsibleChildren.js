// src/components/CollapsibleChildren.js
//
// Wraps any children in a height + opacity animation that transitions
// smoothly between collapsed (height 0, invisible) and expanded (natural
// height, fully visible) whenever `isOpen` changes.
//
// Usage:
//   <CollapsibleChildren isOpen={isOpen}>
//     <SomeContent />
//   </CollapsibleChildren>
//
// Implementation notes:
//   - Natural height is measured via onLayout on a hidden absolute-
//     positioned clone of the children, so we always know the target
//     height before animating to it. This avoids the "animate to zero
//     then jump" problem that comes from animating to `undefined`.
//   - The visible container is clipped (overflow: hidden) so content
//     doesn't bleed out during the height animation.
//   - withTiming duration/easing can be tuned via props if needed later.

import React, { useState } from 'react';
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
  const [measured, setMeasured] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(isOpen ? naturalHeight.value : 0, { duration: DURATION, easing: EASING }),
    opacity: withTiming(isOpen ? 1 : 0, { duration: DURATION, easing: EASING }),
    overflow: 'hidden',
  }));

  const onMeasure = (e) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) {
      naturalHeight.value = h;
      setMeasured(true);
    }
  };

  return (
    <>
      {/* Hidden clone used purely for measurement. Sits off-screen so it
          never flashes visible content before we've measured. */}
      {!measured && (
        <View
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          onLayout={onMeasure}
        >
          {children}
        </View>
      )}

      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </>
  );
}