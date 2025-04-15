import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { savedTranscriptionsStyles as styles } from '../styles';

const SavedTranscriptions = ({ 
  savedTranscriptions, 
  recentTranscription, 
  darkMode, 
  onClose,
  visible,
  onSelectTranscription,
  onDeleteTranscription,
  onRenamePress
}) => {
  const [activeTab, setActiveTab] = useState("saved"); // "saved" or "recent"
  const [selectedTranscription, setSelectedTranscription] = useState(null);
  const [sound, setSound] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSegmentIndex, setPlayingSegmentIndex] = useState(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    // Reset states when a new transcription is selected
    setIsAudioLoaded(false);
    setAudioError(false);
    
    // Unload sound when transcription changes or component unmounts
    return () => {
      if (sound) {
        try {
          sound.pauseAsync().catch(() => {});
          sound.unloadAsync().catch(() => {});
          setSound(null);
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [selectedTranscription]);

  const handleSelectTranscription = (transcription) => {
    setSelectedTranscription(transcription);
    // Reset playback states when new transcription is selected
    setPlaybackPosition(0);
    setPlaybackDuration(0);
    setIsPlaying(false);
    setPlayingSegmentIndex(null);
    setIsAudioLoaded(false);
    setAudioError(false);
  };

  const handleBack = () => {
    setSelectedTranscription(null);
    // Unload audio if any
    if (sound) {
      try {
        sound.pauseAsync().catch(() => {});
        setIsPlaying(false);
      } catch (error) {
        // Ignore errors during navigation
      }
    }
  };

  const handleClose = () => {
    setSelectedTranscription(null);
    onClose();
    if (sound) {
      try {
        sound.pauseAsync().catch(() => {});
        setIsPlaying(false);
      } catch (error) {
        // Ignore errors during navigation
      }
    }
  };

  const handleUseTranscription = () => {
    if (selectedTranscription) {
      onSelectTranscription(selectedTranscription);
      setSelectedTranscription(null);
      onClose();
    }
  };

  const handleEditSpeakers = () => {
    if (selectedTranscription && selectedTranscription.segments && selectedTranscription.segments.length > 0) {
      // Analyze speaker names for potential merging
      const mapping = selectedTranscription.speakerNames || {};
      const mergedMapping = { ...mapping };
      const nameGroups = {};
      
      Object.keys(mapping).forEach(id => {
        const name = mapping[id];
        const lower = name.trim().toLowerCase();
        if (!nameGroups[lower]) {
          nameGroups[lower] = [id];
        } else {
          nameGroups[lower].push(id);
        }
      });
      
      Object.keys(nameGroups).forEach(lower => {
        const ids = nameGroups[lower];
        if (ids.length > 1) {
          const canonical = ids[0];
          ids.forEach(id => {
            mergedMapping[id] = mapping[canonical];
          });
        }
      });
      
      // Pass pre-merged mapping to rename modal
      onRenamePress(selectedTranscription.segments, mergedMapping, (newSpeakerNames) => {
        const updatedTranscription = {
          ...selectedTranscription,
          speakerNames: newSpeakerNames
        };
        
        if (selectedTranscription.segments) {
          const formattedText = selectedTranscription.segments
            .map(segment => {
              const speakerId = segment.speakerId;
              const speakerName = newSpeakerNames[speakerId] || speakerId;
              return `${speakerName}: ${segment.text}`;
            })
            .join('\n\n');
          updatedTranscription.text = formattedText;
        }
        
        setSelectedTranscription(updatedTranscription);
        const index = savedTranscriptions.findIndex(t => t.timestamp === selectedTranscription.timestamp);
        if (index !== -1) {
          const updatedTranscriptions = [...savedTranscriptions];
          updatedTranscriptions[index] = updatedTranscription;
          onDeleteTranscription(updatedTranscriptions);
        }
      });
    }
  };

  const handleDeleteTranscription = () => {
    if (selectedTranscription) {
      Alert.alert(
        "削除の確認",
        `「${selectedTranscription.title}」を削除してもよろしいですか？`,
        [
          {
            text: "キャンセル",
            style: "cancel"
          },
          { 
            text: "削除", 
            style: "destructive",
            onPress: () => {
              const updatedTranscriptions = savedTranscriptions.filter(
                t => t.timestamp !== selectedTranscription.timestamp
              );
              onDeleteTranscription(updatedTranscriptions);
              setSelectedTranscription(null);
              if (sound) {
                try {
                  sound.unloadAsync().catch(() => {});
                  setSound(null);
                } catch (error) {
                  // Ignore errors during deletion
                }
              }
            }
          }
        ]
      );
    }
  };

  const checkAudioExists = async (uri) => {
    if (!uri) return false;
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return fileInfo.exists;
    } catch (error) {
      console.log("Error checking audio file:", error);
      return false;
    }
  };

  const loadAudio = async () => {
    if (audioError) return null;
    if (!isAudioLoaded && selectedTranscription && selectedTranscription.audioURI) {
      try {
        const exists = await checkAudioExists(selectedTranscription.audioURI);
        if (!exists) {
          console.log("Audio file does not exist:", selectedTranscription.audioURI);
          setAudioError(true);
          return null;
        }
        const { sound: newSound, status } = await Audio.Sound.createAsync(
          { uri: selectedTranscription.audioURI },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );
        setSound(newSound);
        setPlaybackPosition(status.positionMillis || 0);
        setPlaybackDuration(status.durationMillis || 0);
        setIsAudioLoaded(true);
        return newSound;
      } catch (error) {
        console.log('Audio load error:', error);
        setAudioError(true);
        return null;
      }
    }
    return sound;
  };

  const onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
      if (selectedTranscription && selectedTranscription.segments && selectedTranscription.segments.length > 0) {
        const segments = selectedTranscription.segments;
        let currentIndex = segments.findIndex((segment, idx) => {
          const nextSegment = segments[idx + 1];
          if (nextSegment) {
            return status.positionMillis >= segment.startTime && status.positionMillis < nextSegment.startTime;
          } else {
            return status.positionMillis >= segment.startTime;
          }
        });
        setPlayingSegmentIndex(currentIndex);
      }
    }
  };

  const handleTogglePlay = async () => {
    if (!selectedTranscription || !selectedTranscription.audioURI || audioError) return;
    try {
      const currentSound = await loadAudio();
      if (currentSound) {
        if (isPlaying) {
          await currentSound.pauseAsync();
        } else {
          await currentSound.playAsync();
        }
      }
    } catch (error) {
      console.log("Error toggling play:", error);
      setAudioError(true);
    }
  };

  const handlePlaySegment = async (segment, index) => {
    if (!selectedTranscription || !selectedTranscription.audioURI || audioError) return;
    try {
      const startTimeMs = typeof segment.startTime === 'number' ? segment.startTime : 0;
      const currentSound = await loadAudio();
      if (currentSound) {
        await currentSound.setPositionAsync(startTimeMs);
        setPlayingSegmentIndex(index);
        if (!isPlaying) {
          await currentSound.playAsync();
        }
      }
    } catch (error) {
      console.log("Error playing segment:", error);
      setAudioError(true);
    }
  };

  const handleSliderComplete = async value => {
    if (!sound || audioError) return;
    try {
      await sound.setPositionAsync(value);
    } catch (error) {
      console.log("Error setting position:", error);
      setAudioError(true);
    }
  };

  const handleDeleteAudio = async () => {
    if (!selectedTranscription || !selectedTranscription.audioURI) return;
    try {
      const exists = await checkAudioExists(selectedTranscription.audioURI);
      if (exists) {
        await FileSystem.deleteAsync(selectedTranscription.audioURI, { idempotent: true });
      }
      
      // Update the transcription to reflect deletion of audio file
      const updatedTranscription = {
        ...selectedTranscription,
        audioURI: null
      };
      
      setSelectedTranscription(updatedTranscription);
      
      // Update in saved transcriptions
      const index = savedTranscriptions.findIndex(t => t.timestamp === selectedTranscription.timestamp);
      if (index !== -1) {
        const updatedTranscriptions = [...savedTranscriptions];
        updatedTranscriptions[index] = updatedTranscription;
        onDeleteTranscription(updatedTranscriptions);
      }
      
      Alert.alert("完了", "音声ファイルを削除しました");
    } catch (error) {
      console.log('Audio deletion error:', error);
      setAudioError(true);
    }
  };

  const handleCopyConversation = async () => {
    if (selectedTranscription && selectedTranscription.text) {
      try {
        await Clipboard.setStringAsync(selectedTranscription.text);
        Alert.alert("コピー完了", "会話全文をクリップボードにコピーしました");
      } catch (error) {
        console.log('Copy error:', error);
        Alert.alert("エラー", "コピーに失敗しました");
      }
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (milliseconds) => {
    if (!milliseconds) return "00:00";
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!visible) {
    return null;
  }

  const listData = activeTab === "saved" ? savedTranscriptions : (recentTranscription ? [recentTranscription] : []);

  const cardBg = darkMode ? '#1f2937' : '#ffffff';
  const textColor = darkMode ? '#f3f4f6' : '#1f2937';
  const subTextColor = darkMode ? '#9ca3af' : '#6b7280';
  const borderColor = darkMode ? '#374151' : '#f3f4f6';
  const bgColor = darkMode ? '#111827' : '#f9fafb';
  const accentColor = '#8b5cf6';
  const dangerColor = '#ef4444';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <LinearGradient
        colors={[darkMode ? '#4f46e5' : '#6366f1', darkMode ? '#2563eb' : '#3b82f6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedTranscription 
              ? selectedTranscription.title 
              : (activeTab === "saved" ? "保存済み文字起こし" : "直近の文字起こし")}
          </Text>
          <View style={styles.headerRight}>
            {selectedTranscription && (
              <TouchableOpacity onPress={handleUseTranscription} style={styles.useButton}>
                <Text style={styles.useButtonText}>使用</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
      
      {!selectedTranscription && (
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === "recent" && styles.tabButtonActive]}
            onPress={() => setActiveTab("recent")}
          >
            <Text style={[styles.tabButtonText, activeTab === "recent" && styles.tabButtonTextActive]}>
              直近の文字起こし
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === "saved" && styles.tabButtonActive]}
            onPress={() => setActiveTab("saved")}
          >
            <Text style={[styles.tabButtonText, activeTab === "saved" && styles.tabButtonTextActive]}>
              保存済み文字起こし
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {selectedTranscription ? (
        <View style={styles.detailContainer}>
          <View style={[styles.detailCard, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Icon name="chevron-left" size={20} color={textColor} />
                <Text style={[styles.backButtonText, { color: textColor }]}>戻る</Text>
              </TouchableOpacity>
              <Text style={[styles.dateText, { color: subTextColor }]}>
                {formatDate(selectedTranscription.timestamp)}
              </Text>
            </View>
            
            <View style={styles.actionButtonsContainer}>
              {selectedTranscription.segments && selectedTranscription.segments.length > 0 && (
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: accentColor }]}
                  onPress={handleEditSpeakers}
                >
                  <Icon name="users" size={16} color="#fff" />
                  <Text style={styles.actionButtonText}>スピーカー編集</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
                onPress={handleCopyConversation}
              >
                <Icon name="copy" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>会話コピー</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: dangerColor }]}
                onPress={handleDeleteTranscription}
              >
                <Icon name="trash-2" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>削除</Text>
              </TouchableOpacity>
            </View>
            
            {selectedTranscription.segments && (
              <View style={styles.conversationSummary}>
                <Text style={[styles.conversationText, { color: textColor }]}>
                  参加者: {Array.from(new Set(selectedTranscription.segments.map(seg => 
                    selectedTranscription.speakerNames[seg.speakerId] || seg.speakerId
                  ))).join(', ')}
                </Text>
              </View>
            )}
            
            <ScrollView style={styles.detailScrollView}>
              {selectedTranscription.segments && selectedTranscription.segments.length > 0 ? (
                selectedTranscription.segments.map((segment, index) => {
                  const highlight = index === playingSegmentIndex;
                  const speakerName = selectedTranscription.speakerNames 
                    ? (selectedTranscription.speakerNames[segment.speakerId] || segment.speakerId)
                    : segment.speakerId;
                  return (
                    <TouchableOpacity 
                      key={index} 
                      onPress={() => handlePlaySegment(segment, index)}
                      style={[styles.segmentItem, highlight && styles.segmentHighlight]}
                    >
                      <View style={styles.segmentHeader}>
                        <Text style={[styles.speakerName, { color: accentColor }]}>
                          {speakerName}
                        </Text>
                        {segment.startTime !== undefined && (
                          <Text style={styles.segmentTime}>
                            {formatTime(segment.startTime)}
                          </Text>
                        )}
                      </View>
                      <Text style={[styles.segmentText, { color: textColor }]}>
                        {segment.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={[styles.detailText, { color: textColor }]}>
                  {selectedTranscription.text}
                </Text>
              )}
            </ScrollView>
            
            {selectedTranscription.audioURI ? (
              audioError ? (
                <View style={styles.audioErrorContainer}>
                  <Text style={styles.audioErrorText}>
                    音声ファイルは利用できません
                  </Text>
                </View>
              ) : (
                <View style={styles.audioControlContainer}>
                  <View style={styles.audioControlHeader}>
                    <Text style={[styles.audioTitle, { color: textColor }]}>
                      音声再生
                    </Text>
                    <TouchableOpacity 
                      onPress={handleDeleteAudio} 
                      style={styles.deleteAudioButton}
                    >
                      <Icon name="trash-2" size={14} color="#fff" />
                      <Text style={styles.deleteAudioButtonText}>削除</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.sliderContainer}>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={playbackDuration > 0 ? playbackDuration : 1}
                      value={playbackPosition}
                      minimumTrackTintColor={accentColor}
                      maximumTrackTintColor={darkMode ? "#4b5563" : "#d1d5db"}
                      thumbTintColor={accentColor}
                      onSlidingComplete={handleSliderComplete}
                    />
                    <View style={styles.timeContainer}>
                      <Text style={[styles.timeText, { color: textColor }]}>
                        {formatTime(playbackPosition)}
                      </Text>
                      <Text style={[styles.timeText, { color: textColor }]}>
                        {formatTime(playbackDuration)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    onPress={handleTogglePlay} 
                    style={[styles.playPauseButton, { backgroundColor: isPlaying ? '#f59e0b' : '#10b981' }]}
                  >
                    <Icon name={isPlaying ? "pause" : "play"} size={20} color="#fff" />
                    <Text style={styles.playPauseButtonText}>
                      {isPlaying ? "一時停止" : "再生"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            ) : null}
          </View>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {listData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="file-text" size={48} color={subTextColor} />
              <Text style={[styles.emptyText, { color: subTextColor }]}>
                {activeTab === "saved" ? "保存された文字起こしはありません" : "直近の文字起こしはありません"}
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.scrollView}>
              {listData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.transcriptionItem, { backgroundColor: cardBg, borderColor }]}
                  onPress={() => handleSelectTranscription(item)}
                >
                  <Text style={[styles.itemTitle, { color: textColor }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.itemDate, { color: subTextColor }]}>
                    {formatDate(item.timestamp)}
                  </Text>
                  <Text style={[styles.itemText, { color: textColor }]} numberOfLines={2}>
                    {item.text}
                  </Text>
                  {item.audioURI && (
                    <View style={styles.itemAudioIndicator}>
                      <Icon name="headphones" size={12} color={accentColor} />
                      <Text style={[styles.itemAudioText, { color: accentColor }]}>
                        音声あり
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default SavedTranscriptions;
