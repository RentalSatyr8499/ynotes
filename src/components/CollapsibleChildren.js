// src/components/CollapsibleChildren.js
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const DURATION = 220;
const EASING = Easing.inOut(Easing.ease);

export default function CollapsibleChildren({ isOpen, children, debugLabel = '' }) {
  const naturalHeight = useSharedValue(0);
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    console.log(`[CollapsibleChildren${debugLabel ? ` "${debugLabel}"` : ''}] isOpen=${isOpen} measured=${measured} naturalHeight=${naturalHeight.value}`);
  }, [isOpen, measured]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(isOpen ? naturalHeight.value : 0, { duration: DURATION, easing: EASING }),
    opacity: withTiming(isOpen ? 1 : 0, { duration: DURATION, easing: EASING }),
    overflow: 'hidden',
  }));

  const onMeasure = (e) => {
    const h = e.nativeEvent.layout.height;
    console.log(`[CollapsibleChildren${debugLabel ? ` "${debugLabel}"` : ''}] onMeasure h=${h}`);
    if (h > 0) {
      naturalHeight.value = h;
      setMeasured(true);
    }
  };

  return (
    <>
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