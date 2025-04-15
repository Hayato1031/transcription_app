import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const ControlButtons = ({
  isRecording,
  startRecording,
  stopRecording,
  saveTranscription,
  clearTranscription,
  hasTranscription,
  darkMode,
}) => {
  return (
    <View style={styles.container}>
      {!isRecording ? (
        <TouchableOpacity onPress={startRecording} style={styles.buttonContainer}>
          <LinearGradient
            colors={['#8b5cf6', '#ec4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Icon name="mic" size={28} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={stopRecording} style={styles.buttonContainer}>
          <LinearGradient
            colors={['#ef4444', '#ec4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Icon name="stop-circle" size={28} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={saveTranscription}
        style={[styles.buttonContainer, !hasTranscription && styles.disabledButton]}
        disabled={!hasTranscription}
      >
        <LinearGradient
          colors={['#10b981', '#14b8a6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
          opacity={hasTranscription ? 1 : 0.5}
        >
          <Icon name="save" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={clearTranscription}
        style={[styles.buttonContainer, !hasTranscription && styles.disabledButton]}
        disabled={!hasTranscription}
      >
        <View
          style={[
            styles.button,
            {
              backgroundColor: darkMode ? '#4b5563' : '#e5e7eb',
            },
          ]}
        >
          <Icon
            name="trash-2"
            size={28}
            color={darkMode ? '#fff' : '#4b5563'}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 24,
  },
  buttonContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ControlButtons;
