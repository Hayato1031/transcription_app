import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const TranscriptionDisplay = ({ 
  transcription, 
  isRecording, 
  darkMode,
  hasSegments,
  onRenamePress
}) => {
  const cardBg = darkMode ? '#1f2937' : '#ffffff';
  const textColor = darkMode ? '#f3f4f6' : '#1f2937';
  const subTextColor = darkMode ? '#9ca3af' : '#6b7280';
  const borderColor = darkMode ? '#374151' : '#f3f4f6';
  const iconColor = darkMode ? '#1f2937' : '#4b5563';
  const emptyBgColor = darkMode ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.05)';
  const accentColor = '#8b5cf6';

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
      {transcription ? (
        <View style={styles.contentContainer}>
          <View style={styles.toolbarContainer}>
            {hasSegments && (
              <TouchableOpacity 
                style={[styles.toolbarButton, { borderColor }]} 
                onPress={onRenamePress}
              >
                <Icon name="users" size={16} color={textColor} />
                <Text style={[styles.toolbarButtonText, { color: textColor }]}>
                  スピーカー設定
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <ScrollView style={styles.scrollView}>
            <Text style={[styles.transcriptionText, { color: textColor }]}>
              {transcription}
            </Text>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconContainer,
              { backgroundColor: emptyBgColor },
            ]}
          >
            <Icon name="mic" size={36} color={iconColor} />
          </View>
          <Text style={[styles.emptyText, { color: subTextColor }]}>
            {isRecording
              ? '音声を認識しています...'
              : 'マイクボタンを押して録音を開始してください'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
  },
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginLeft: 8,
  },
  toolbarButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  transcriptionText: {
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    maxWidth: '80%',
  },
});

export default TranscriptionDisplay;
