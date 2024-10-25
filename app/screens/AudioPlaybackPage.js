// AudioPlaybackPage.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import color from '../misc/color';

const AudioPlaybackPage = ({ navigation }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const route = useRoute();
  const { uri } = route.params;

  useEffect(() => {
    const loadAndPlay = async () => {
      if (!uri) {
        Alert.alert('Error', 'No audio file found.');
        return;
      }
      try {
        const { sound } = await Audio.Sound.createAsync({ uri });
        setSound(sound);
        await sound.playAsync();
        setIsPlaying(true);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } catch (error) {
        console.error('Error playing sound:', error);
        Alert.alert('Error', 'Failed to play sound.');
      }
    };

    if (uri) {
      loadAndPlay();
    }

    return () => sound ? sound.unloadAsync() : undefined; // Cleanup on unmount
  }, [uri]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound) {
          sound.stopAsync();
          setIsPlaying(false);
        }
      };
    }, [sound])
  );

  const handlePlayPause = async () => {
    if (isPlaying) {
      await sound.stopAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const detectVoice = () => {
    const realPercentage = 75; // Example detection logic
    const fakePercentage = 25; // Example detection logic
    navigation.navigate('DetectionResult', {
      realPercentage,
      fakePercentage,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tagline}>Play Your Voice Recording</Text>
      <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
        <Text style={styles.buttonText}>{isPlaying ? 'Stop' : 'Play Audio'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.detectButton} onPress={detectVoice}>
        <Text style={styles.buttonText}>Detect</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  tagline: {
    fontSize: 28,
    color: color.FONT,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AudioPlaybackPage;
