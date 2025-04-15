import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const Header = ({ 
  darkMode, 
  onMenuPress
}) => {
  return (
    <LinearGradient
      colors={['#8b5cf6', '#ec4899']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={onMenuPress}
        >
          <Icon name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>VOICE NOTE</Text>
        <View style={styles.buttonContainer}>
          {/* Empty view to maintain layout balance */}
          <View style={{ width: 40 }} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  demoModeActive: {
    backgroundColor: 'rgba(255, 255, 0, 0.3)',
  },
});

export default Header;
