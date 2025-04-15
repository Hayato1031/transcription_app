import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const SpeakerRenameModal = ({
  visible,
  onClose,
  segments,
  speakerNames,
  onSpeakerNamesChange,
  darkMode,
}) => {
  const [localSpeakerNames, setLocalSpeakerNames] = useState({});

  // Initialize local state when modal opens
  useEffect(() => {
    if (visible) {
      setLocalSpeakerNames({ ...speakerNames });
    }
  }, [visible, speakerNames]);

  // Get unique speaker IDs
  const speakerIds = segments && segments.length
    ? [...new Set(segments.map(segment => segment.speakerId))]
    : [];

  const handleSave = () => {
    onSpeakerNamesChange(localSpeakerNames);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const updateSpeakerName = (speakerId, name) => {
    setLocalSpeakerNames(prev => ({
      ...prev,
      [speakerId]: name,
    }));
  };

  // Merge speakers: Group by case-insensitive trimmed name and update names for duplicates
  const handleMergeSpeakers = () => {
    const groups = {};
    Object.keys(localSpeakerNames).forEach(id => {
      const name = localSpeakerNames[id].trim().toLowerCase();
      if (!groups[name]) {
        groups[name] = [id];
      } else {
        groups[name].push(id);
      }
    });
    const newNames = { ...localSpeakerNames };
    Object.keys(groups).forEach(nameKey => {
      const ids = groups[nameKey];
      if (ids.length > 1) {
        // Merge: set all speakers' names to the first one's original display
        const canonical = newNames[ids[0]];
        ids.forEach(id => {
          newNames[id] = canonical;
        });
      }
    });
    setLocalSpeakerNames(newNames);
    Alert.alert("統合完了", "同一人物の統合が完了しました。");
  };

  // Theme colors
  const textColor = darkMode ? '#f3f4f6' : '#1f2937';
  const bgColor = darkMode ? '#111827' : '#f9fafb';
  const cardBg = darkMode ? '#1f2937' : '#ffffff';
  const inputBgColor = darkMode ? '#374151' : '#f3f4f6';
  const borderColor = darkMode ? '#4b5563' : '#e5e7eb';
  const accentColor = '#8b5cf6';

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleCancel}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <LinearGradient
          colors={['#8b5cf6', '#ec4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Icon name="x" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>スピーカー設定</Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>保存</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            スピーカー名の編集
          </Text>
          <Text style={[styles.sectionDescription, { color: textColor }]}>
            各スピーカーの名前を設定して、文字起こしを見やすくします。
          </Text>
          
          <ScrollView style={styles.speakersList}>
            {speakerIds.map((speakerId, index) => (
              <View 
                key={speakerId} 
                style={[
                  styles.speakerCard, 
                  { backgroundColor: cardBg, borderColor }
                ]}
              >
                <View style={styles.speakerHeader}>
                  <View style={[styles.speakerIcon, { backgroundColor: accentColor }]}>
                    <Icon name="user" size={16} color="#fff" />
                  </View>
                  <Text style={[styles.speakerIdText, { color: textColor }]}>
                    {`スピーカー ${index + 1}`}
                  </Text>
                </View>
                
                <View style={styles.speakerInputContainer}>
                  <Text style={[styles.inputLabel, { color: textColor }]}>
                    表示名:
                  </Text>
                  <TextInput
                    style={[
                      styles.speakerInput,
                      { backgroundColor: inputBgColor, color: textColor, borderColor },
                    ]}
                    value={localSpeakerNames[speakerId] || ''}
                    onChangeText={(text) => updateSpeakerName(speakerId, text)}
                    placeholder="スピーカー名を入力"
                    placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={handleMergeSpeakers} style={styles.mergeButton}>
            <Text style={styles.mergeButtonText}>同一人物の統合</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 24,
    opacity: 0.8,
  },
  speakersList: {
    flex: 1,
  },
  speakerCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  speakerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  speakerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  speakerIdText: {
    fontSize: 16,
    fontWeight: '500',
  },
  speakerInputContainer: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  speakerInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  mergeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 16,
  },
  mergeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SpeakerRenameModal;
