import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WaveformAnimation = () => {
  return (
    <View style={styles.waveformContainer}>
      {[...Array(5)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.waveBar,
            {
              height: 8 + (i % 3) * 4,
              opacity: Math.random() * 0.5 + 0.5, // Simulate animation
            },
          ]}
        />
      ))}
    </View>
  );
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const RecordingStatus = ({ isRecording, elapsedTime, darkMode }) => {
  const cardBg = darkMode ? '#1f2937' : '#ffffff';
  const textColor = darkMode ? '#f3f4f6' : '#1f2937';
  const borderColor = darkMode ? '#374151' : '#f3f4f6';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cardBg,
          borderColor: borderColor,
        },
      ]}
    >
      <View style={styles.statusContainer}>
        {isRecording ? (
          <View style={styles.recordingContainer}>
            <View style={styles.recordingIndicator} />
            <Text style={[styles.statusText, { color: textColor }]}>録音中</Text>
            <WaveformAnimation />
          </View>
        ) : (
          <View style={styles.recordingContainer}>
            <View style={styles.idleIndicator} />
            <Text style={[styles.statusText, { color: textColor }]}>待機中</Text>
          </View>
        )}
      </View>
      {isRecording && (
        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ec4899',
    opacity: 0.8,
  },
  idleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#9ca3af',
  },
  statusText: {
    fontWeight: '500',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 4,
  },
  waveBar: {
    width: 4,
    backgroundColor: '#ec4899',
    borderRadius: 2,
  },
  timerText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ec4899',
  },
});

export default RecordingStatus;
