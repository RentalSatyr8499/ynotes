// src/components/ErrorBoundary.js

import React from 'react';
import { View, Text, Pressable } from 'react-native';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, hovered: false };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error.message, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text style={{ color: 'red', marginBottom: 12, textAlign: 'center' }}>
            Internal error. ({this.state.error.message}) 
          </Text>
          {this.props.onReset && (
            <Pressable
              onPress={() => {
                this.setState({ error: null, hovered: false });
                this.props.onReset();
              }}
              onHoverIn={() => this.setState({ hovered: true })}
              onHoverOut={() => this.setState({ hovered: false })}
            >
              <Text style={{ textDecorationLine: this.state.hovered ? 'underline' : 'none' }}>
                Try again
              </Text>
            </Pressable>
          )}
        </View>
      );
    }
    return this.props.children;
  }
}