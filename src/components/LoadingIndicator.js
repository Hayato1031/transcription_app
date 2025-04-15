import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingIndicator = ({ visible, message, darkMode }) => {
  if (!visible) return null;

  const textColor = darkMode ? '#f3f4f6' : '#1f2937';
  const bgColor = darkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)';

  return (
    <View style={styles.container}>
      <View style={[styles.loadingBox, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={[styles.loadingText, { color: textColor }]}>
          {message || '処理中...'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingBox: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LoadingIndicator;
