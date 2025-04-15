import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, Alert, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ELEVEN_LABS_API_KEY } from '@env';

// Import components
import Header from './components/Header';
import RecordingStatus from './components/RecordingStatus';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import SavedTranscriptions from './components/SavedTranscriptions';
import ControlButtons from './components/ControlButtons';
import LoadingIndicator from './components/LoadingIndicator';
import SpeakerRenameModal from './components/SpeakerRenameModal';
import SaveTranscriptModal from './components/SaveTranscriptModal';
import SideMenu from './components/SideMenu';
import Settings from './components/Settings';

// Import API service and utilities
import { transcribeAudio } from './services/elevenlabsApi';
import { processTranscription, getDefaultSpeakerNames } from './utils/transcriptionUtils';

// Storage key for saved transcriptions
const STORAGE_KEY = 'saved_transcriptions';

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [savedTranscriptions, setSavedTranscriptions] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [demoMode, setDemoMode] = useState(false); // Use state instead of ref for demo mode
  const [appEnabled, setAppEnabled] = useState(true); // Kill switch for version management
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [loadingMessage, setLoadingMessage] = useState(""); // Loading message
  const [transcriptionData, setTranscriptionData] = useState(null); // Raw transcription data
  const [segments, setSegments] = useState([]); // Processed segments
  const [speakerNames, setSpeakerNames] = useState({}); // Speaker names mapping
  const [renameModalVisible, setRenameModalVisible] = useState(false); // Rename modal visibility
  const [saveModalVisible, setSaveModalVisible] = useState(false); // Save modal visibility
  const [showSavedTranscriptions, setShowSavedTranscriptions] = useState(false); // Show saved transcriptions
  const [sideMenuVisible, setSideMenuVisible] = useState(false); // Side menu visibility
  const [settingsVisible, setSettingsVisible] = useState(false); // Settings visibility
  const [saveAudioEnabled, setSaveAudioEnabled] = useState(false); // Switch: whether to save audio files persistently
  const [audioFiles, setAudioFiles] = useState([]); // Array of saved audio file info objects { uri, size }
  const [totalAudioSize, setTotalAudioSize] = useState(0); // Total size of saved audio files

  // App version
  const APP_VERSION = "1.0.0";
  
  // References
  const recording = useRef(null);
  const timer = useRef(null);
  const savedTranscriptionCallback = useRef(null);

  // Load saved transcriptions from AsyncStorage
  useEffect(() => {
    loadSavedTranscriptions();
  }, []);

  // Request permissions for audio recording
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'This app needs microphone access to record audio for transcription.',
          [{ text: 'OK' }]
        );
      }
    })();

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  // Load saved transcriptions from AsyncStorage
  const loadSavedTranscriptions = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setSavedTranscriptions(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Failed to load saved transcriptions:', error);
    }
  };

  // Save transcriptions to AsyncStorage
  const persistSavedTranscriptions = async (transcriptions) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transcriptions));
    } catch (error) {
      console.error('Failed to save transcriptions:', error);
    }
  };

  // Check if app is enabled (kill switch for version management)
  useEffect(() => {
    const checkAppStatus = async () => {
      try {
        const minimumRequiredVersion = "1.0.0";
        const isVersionValid = APP_VERSION >= minimumRequiredVersion;
        
        if (!isVersionValid) {
          setAppEnabled(false);
          Alert.alert(
            "アップデートが必要です",
            "このバージョンのアプリはサポートされていません。最新版にアップデートしてください。",
            [{ text: "OK" }]
          );
        }
      } catch (error) {
        console.error("Failed to check app status:", error);
      }
    };
    checkAppStatus();
  }, []);

  // Update elapsed time
  useEffect(() => {
    if (!appEnabled) return;
    if (isRecording) {
      timer.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timer.current) clearInterval(timer.current);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [isRecording, appEnabled]);

  // Start recording
  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording.current = newRecording;
      setIsRecording(true);
      setElapsedTime(0);
      setTranscription("");
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  // Handle speaker rename
  const handleRenamePress = () => {
    setRenameModalVisible(true);
  };
  
  // Update speaker names (with callback support from saved transcriptions rename)
  const handleSpeakerNamesChange = (newSpeakerNames) => {
    setSpeakerNames(newSpeakerNames);
    if (savedTranscriptionCallback.current) {
      savedTranscriptionCallback.current(newSpeakerNames);
      savedTranscriptionCallback.current = null;
    } else if (transcriptionData) {
      const processed = processTranscription(transcriptionData, newSpeakerNames);
      setTranscription(processed.text);
    }
  };
  
  // Create demo transcription with speakers (for demo mode)
  const createDemoTranscriptionWithSpeakers = () => {
    const demoSegments = [
      {
        speakerId: 'speaker_1',
        speakerName: 'Speaker 1',
        text: 'こんにちは、音声認識のテストです。この文字起こしアプリは、会話を自動的にテキストに変換します。',
        startTime: 0,
        endTime: 5,
      },
      {
        speakerId: 'speaker_2',
        speakerName: 'Speaker 2',
        text: 'ボタンを押すと録音が開始され、停止ボタンで終了します。文字起こしされたテキストはリアルタイムで表示されます。',
        startTime: 5,
        endTime: 10,
      },
      {
        speakerId: 'speaker_1',
        speakerName: 'Speaker 1',
        text: '保存ボタンを押すとテキストを保存できます。',
        startTime: 10,
        endTime: 15,
      },
    ];
    setSegments(demoSegments);
    const defaultNames = {
      'speaker_1': 'Speaker 1',
      'speaker_2': 'Speaker 2',
    };
    setSpeakerNames(defaultNames);
    const formattedText = demoSegments
      .map(segment => `${segment.speakerName}: ${segment.text}`)
      .join('\n\n');
    setTranscription(formattedText);
  };
  
  // Stop recording: Process audio, send to API (generic description), and handle audio saving if enabled
  const stopRecording = async () => {
    try {
      setIsRecording(false);
      if (!recording.current) return;
      await recording.current.stopAndUnloadAsync();
      if (!demoMode) {
        const uri = recording.current.getURI();
        // Check if API key is available
        if (!ELEVEN_LABS_API_KEY || ELEVEN_LABS_API_KEY === 'your_api_key_here') {
          Alert.alert(
            "API キーエラー",
            "有効なAPIキーが設定されていません。デモモードに切り替えます。",
            [{ text: "OK" }]
          );
          setDemoMode(true);
          return;
        }
        try {
          setIsLoading(true);
          setLoadingMessage("音声を文字起こししています...");
          console.log('録音データを送信中:', uri);
          const result = await transcribeAudio(uri);
          if (result) {
            setTranscriptionData(result);
            const defaultSpeakerNames = getDefaultSpeakerNames(result.words);
            setSpeakerNames(defaultSpeakerNames);
            const processed = processTranscription(result, defaultSpeakerNames);
            setSegments(processed.segments);
            setTranscription(processed.text);
          } else {
            throw new Error('No transcription data returned');
          }
        } catch (error) {
          console.error('Transcription error:', error);
          let errorMessage = '音声の文字起こしに失敗しました';
          if (error.response && error.response.status === 401) {
            errorMessage = 'API認証エラー: API キーが無効です';
          } else if (error.response && error.response.status === 429) {
            errorMessage = 'API使用制限エラー: APIの使用回数制限に達しました';
          } else if (error.message && error.message.includes('network')) {
            errorMessage = 'ネットワークエラー: インターネット接続を確認してください';
          }
          Alert.alert('エラー', errorMessage);
        } finally {
          setIsLoading(false);
        }
      } else {
        createDemoTranscriptionWithSpeakers();
      }
      // If saving audio is enabled, move temporary audio file to persistent storage
      if (saveAudioEnabled) {
        const uri = recording.current.getURI();
        const newFileName = new Date().getTime() + ".m4a";
        const destination = FileSystem.documentDirectory + "audios/" + newFileName;
        try {
          await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "audios", { intermediates: true });
          await FileSystem.moveAsync({
            from: uri,
            to: destination
          });
          const fileInfo = await FileSystem.getInfoAsync(destination);
          setAudioFiles(prev => [...prev, { uri: destination, size: fileInfo.size }]);
          setTotalAudioSize(prev => prev + fileInfo.size);
          console.log("Audio saved permanently:", destination);
        } catch (error) {
          console.error("Audio saving error:", error);
        }
      }
      recording.current = null;
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    } catch (error) {
      console.error('Failed to stop recording', error);
      setIsLoading(false);
    }
  };
  
  // Toggle side menu
  const toggleSideMenu = () => {
    setSideMenuVisible(!sideMenuVisible);
  };

  // Show settings
  const showSettings = () => {
    setSettingsVisible(true);
    setSideMenuVisible(false);
  };

  // Show history (saved transcriptions)
  const showHistory = () => {
    setShowSavedTranscriptions(true);
    setSideMenuVisible(false);
  };

  // Handle selecting a saved transcription
  const handleSelectTranscription = (selectedTranscription) => {
    setTranscription(selectedTranscription.text);
    if (selectedTranscription.segments && selectedTranscription.segments.length > 0) {
      setSegments(selectedTranscription.segments);
      setSpeakerNames(selectedTranscription.speakerNames || {});
    }
  };
  
  // Handle deleting saved transcriptions
  const handleDeleteTranscriptions = (updatedTranscriptions) => {
    setSavedTranscriptions(updatedTranscriptions);
    persistSavedTranscriptions(updatedTranscriptions);
  };
  
  // Handle speaker rename from saved transcriptions
  const handleSavedTranscriptionRename = (segments, speakerNames, callback) => {
    savedTranscriptionCallback.current = callback;
    setSegments([...segments]);
    setSpeakerNames({...speakerNames});
    setRenameModalVisible(true);
  };

  // Save transcription with title
  const saveTranscription = () => {
    if (transcription.trim()) {
      setSaveModalVisible(true);
    }
  };

  // Handle save with title
  const handleSaveWithTitle = (title) => {
    const newTranscription = {
      title,
      text: transcription,
      timestamp: new Date().getTime(),
      segments: segments,
      speakerNames: speakerNames,
      // If audio saving is enabled and an audio file was saved, associate the latest audio file with this transcript
      audioURI: saveAudioEnabled && audioFiles.length > 0 ? audioFiles[audioFiles.length - 1].uri : null,
      audioSize: saveAudioEnabled && audioFiles.length > 0 ? audioFiles[audioFiles.length - 1].size : null
    };
    const updatedTranscriptions = [newTranscription, ...savedTranscriptions];
    setSavedTranscriptions(updatedTranscriptions);
    persistSavedTranscriptions(updatedTranscriptions);
    setTranscription("");
    setSegments([]);
  };

  // Clear transcription
  const clearTranscription = () => {
    setTranscription("");
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Toggle demo mode
  const toggleDemoMode = () => {
    const newDemoMode = !demoMode;
    if (!newDemoMode && (!ELEVEN_LABS_API_KEY || ELEVEN_LABS_API_KEY === 'your_api_key_here')) {
      Alert.alert(
        "API キーが必要です",
        "APIモードを使用するには、有効なAPIキーを .env ファイルに設定する必要があります。",
        [{ text: "OK" }]
      );
      return;
    }
    setDemoMode(newDemoMode);
    Alert.alert(
      newDemoMode ? "デモモード: オン" : "APIモード: オン",
      newDemoMode 
        ? "デモモードでは、実際のAPIを使用せずにアプリの機能をテストできます。" 
        : "APIモードでは、実際のAPIを使用して音声を文字起こしします。",
      [{ text: "OK" }]
    );
  };

  const bgColor = darkMode ? '#111827' : '#f9fafb';

  // Render main app content
  const renderMainContent = () => {
    return (
      <>
        <Header 
          darkMode={darkMode}
          onMenuPress={toggleSideMenu}
        />
        <View style={styles.content}>
          <RecordingStatus 
            isRecording={isRecording} 
            elapsedTime={elapsedTime} 
            darkMode={darkMode} 
          />
          <TranscriptionDisplay 
            transcription={transcription} 
            isRecording={isRecording} 
            darkMode={darkMode}
            hasSegments={segments.length > 0}
            onRenamePress={handleRenamePress}
          />
          <ControlButtons 
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            saveTranscription={saveTranscription}
            clearTranscription={clearTranscription}
            hasTranscription={transcription.trim().length > 0}
            darkMode={darkMode}
          />
        </View>
      </>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        
        {/* Loading Modal - Non-dismissible, blocks interaction */}
        {isLoading && (
          <Modal transparent={true} animationType="fade" visible={isLoading} onRequestClose={() => {}}>
            <View style={styles.loadingOverlay}>
              <LoadingIndicator 
                visible={true} 
                message={loadingMessage} 
                darkMode={darkMode} 
              />
            </View>
          </Modal>
        )}
        
        <SpeakerRenameModal
          visible={renameModalVisible}
          onClose={() => setRenameModalVisible(false)}
          segments={segments}
          speakerNames={speakerNames}
          onSpeakerNamesChange={handleSpeakerNamesChange}
          darkMode={darkMode}
        />
        
        <SaveTranscriptModal
          visible={saveModalVisible}
          onClose={() => setSaveModalVisible(false)}
          onSave={handleSaveWithTitle}
          darkMode={darkMode}
        />
        
        <Settings
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          demoMode={demoMode}
          toggleDemoMode={toggleDemoMode}
          totalAudioSize={totalAudioSize}
          audioFiles={audioFiles}
          saveAudioEnabled={saveAudioEnabled}
          setSaveAudioEnabled={setSaveAudioEnabled}
        />
        
        <SavedTranscriptions 
          savedTranscriptions={savedTranscriptions} 
          darkMode={darkMode}
          visible={showSavedTranscriptions}
          onClose={() => setShowSavedTranscriptions(false)}
          onSelectTranscription={handleSelectTranscription}
          onDeleteTranscription={handleDeleteTranscriptions}
          onRenamePress={handleSavedTranscriptionRename}
        />
        
        {!showSavedTranscriptions && !settingsVisible && renderMainContent()}
      </SafeAreaView>
      
      <SideMenu
        visible={sideMenuVisible}
        onClose={() => setSideMenuVisible(false)}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        demoMode={demoMode}
        toggleDemoMode={toggleDemoMode}
        savedTranscriptions={savedTranscriptions}
        onSelectTranscription={handleSelectTranscription}
        onShowSettings={showSettings}
        onShowHistory={showHistory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
