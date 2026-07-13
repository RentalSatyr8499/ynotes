// src/hooks/useFadeIn.js

import { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const FADE_DURATION = 180;
const FADE_EASING   = Easing.inOut(Easing.ease);

export function useFadeIn() {
  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  function trigger() {
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: FADE_DURATION, easing: FADE_EASING });
  }
  return { animatedStyle, trigger };
}