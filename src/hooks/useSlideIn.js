// src/hooks/useSlideIn.js

import { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const SLIDE_DURATION = 180;
const SLIDE_EASING   = Easing.inOut(Easing.ease);

const DIRECTIONS = {
  left:  { translateX: -20 },
  right: { translateX:  20 },
  up:    { translateY: -20 },
  down:  { translateY:  20 },
};

export function useSlideIn({ direction = 'right', distance = 20 } = {}) {
  const axis     = direction === 'left' || direction === 'right' ? 'translateX' : 'translateY';
  const sign     = direction === 'right' || direction === 'down' ? 1 : -1;
  const from     = sign * distance;

  const opacity   = useSharedValue(0);
  const translate = useSharedValue(from);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ [axis]: translate.value }],
  }));

  function trigger() {
    opacity.value   = 0;
    translate.value = from;
    opacity.value   = withTiming(1,  { duration: SLIDE_DURATION, easing: SLIDE_EASING });
    translate.value = withTiming(0,  { duration: SLIDE_DURATION, easing: SLIDE_EASING });
  }

  return { animatedStyle, trigger };
}