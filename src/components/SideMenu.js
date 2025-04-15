import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  SafeAreaView,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

// Create an animated version of LinearGradient
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.8;

const SideMenu = ({
  visible,
  onClose,
  darkMode,
  toggleDarkMode,
  demoMode,
  toggleDemoMode,
  savedTranscriptions,
  onSelectTranscription,
  onShowSettings,
  onShowHistory,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Animated values for gradient animation
  const gradientPos = useRef(new Animated.Value(0)).current;
  
  // Start gradient animation when menu is visible
  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.timing(gradientPos, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    } else {
      gradientPos.setValue(0);
    }
  }, [visible, gradientPos]);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -MENU_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        setIsVisible(false);
      });
    }
  }, [visible, slideAnim, fadeAnim]);

  if (!isVisible) return null;

  const bgColor = darkMode ? '#111827' : '#f9fafb';
  const textColor = darkMode ? '#f3f4f6' : '#1f2937';
  const subTextColor = darkMode ? '#9ca3af' : '#6b7280';
  const itemBgColor = darkMode ? '#1f2937' : '#ffffff';
  const borderColor = darkMode ? '#374151' : '#e5e7eb';

  // Interpolate gradient position for animation
  const gradientStart = gradientPos.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [{ x: 0, y: 0 }, { x: 0.5, y: 0 }, { x: 1, y: 0 }]
  });
  
  const gradientEnd = gradientPos.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [{ x: 1, y: 0 }, { x: 1.5, y: 0 }, { x: 2, y: 0 }]
  });

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

  const handleClose = () => {
    onClose();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.overlay,
          { opacity: fadeAnim }
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.menu,
          { backgroundColor: bgColor, transform: [{ translateX: slideAnim }] }
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <AnimatedGradient
            colors={['#8b5cf6', '#ec4899', '#8b5cf6']}
            start={gradientStart}
            end={gradientEnd}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>VOICE NOTE</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Icon name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </AnimatedGradient>

          <ScrollView style={styles.scrollView}>
            <View style={styles.menuSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>メニュー</Text>
              
              <TouchableOpacity
                style={[styles.menuItem, { backgroundColor: itemBgColor, borderColor }]}
                onPress={onShowHistory}
              >
                <Icon name="clock" size={20} color={textColor} />
                <Text style={[styles.menuItemText, { color: textColor }]}>履歴</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.menuItem, { backgroundColor: itemBgColor, borderColor }]}
                onPress={onShowSettings}
              >
                <Icon name="settings" size={20} color={textColor} />
                <Text style={[styles.menuItemText, { color: textColor }]}>設定</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>最近の文字起こし</Text>
              
              {savedTranscriptions.length === 0 ? (
                <View style={[styles.emptyContainer, { borderColor }]}>
                  <Text style={[styles.emptyText, { color: subTextColor }]}>
                    保存された文字起こしはありません
                  </Text>
                </View>
              ) : (
                savedTranscriptions.slice(0, 5).map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.historyItem, { backgroundColor: itemBgColor, borderColor }]}
                    onPress={() => {
                      onSelectTranscription(item);
                      onClose();
                    }}
                  >
                    <Text style={[styles.historyTitle, { color: textColor }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={[styles.historyDate, { color: subTextColor }]}>
                      {formatDate(item.timestamp)}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
              
              {savedTranscriptions.length > 0 && (
                <TouchableOpacity
                  style={[styles.viewAllButton, { borderColor }]}
                  onPress={() => {
                    onShowHistory();
                    onClose();
                  }}
                >
                  <Text style={[styles.viewAllText, { color: textColor }]}>すべて表示</Text>
                  <Icon name="chevron-right" size={16} color={textColor} />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999, // Increased z-index to ensure it's on top
    elevation: 9999, // For Android
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: MENU_WIDTH,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 10000, // Ensure menu is above overlay
  },
  safeArea: {
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
  menuSection: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  historyItem: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});

export default SideMenu;
