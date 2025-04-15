import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const SaveTranscriptModal = ({ 
  visible, 
  onClose, 
  onSave, 
  darkMode 
}) => {
  const [title, setTitle] = useState('');

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim());
      setTitle('');
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle('');
    onClose();
  };

  // Theme colors
  const bgColor = darkMode ? '#1f2937' : '#ffffff';
  const textColor = darkMode ? '#f3f4f6' : '#1f2937';
  const placeholderColor = darkMode ? '#9ca3af' : '#9ca3af';
  const inputBgColor = darkMode ? '#374151' : '#f9fafb';
  const borderColor = darkMode ? '#4b5563' : '#e5e7eb';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: bgColor, borderColor }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                文字起こしを保存
              </Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <Icon name="x" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.inputLabel, { color: textColor }]}>
              タイトル
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: inputBgColor, 
                  color: textColor,
                  borderColor
                }
              ]}
              placeholder="タイトルを入力してください"
              placeholderTextColor={placeholderColor}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton, { borderColor }]} 
                onPress={handleCancel}
              >
                <Text style={[styles.buttonText, { color: textColor }]}>
                  キャンセル
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.button, 
                  styles.saveButton,
                  !title.trim() && styles.disabledButton
                ]} 
                onPress={handleSave}
                disabled={!title.trim()}
              >
                <Text style={styles.saveButtonText}>
                  保存
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: '#8b5cf6',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SaveTranscriptModal;
