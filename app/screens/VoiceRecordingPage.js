// VoiceRecordingPage.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';

const VoiceRecordingPage = ({ navigation }) => {
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedUri, setRecordedUri] = useState(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access microphone was denied');
    }
  };

  const onRecordingStatusUpdate = (status) => {
    if (status.isDoneRecording) {
      setIsRecording(false);
      setIsPaused(false);
      console.log('Recording finished');
    }
  };

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        onRecordingStatusUpdate
      );
      setRecording(recording);
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording: ' + err.message);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    setIsPaused(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordedUri(uri);
    console.log('Recording URI:', uri);
  };

  const resumeRecording = async () => {
    setIsPaused(false);
    await recording.resumeAsync();
  };

  const handlePausePress = async () => {
    if (isRecording) {
      setIsPaused(true);
      await recording.pauseAsync();
    }
  };

  const handleRecordPress = async () => {
    if (isRecording) {
      if (isPaused) {
        await resumeRecording();
      } else {
        await stopRecording();
      }
    } else {
      await startRecording();
    }
  };

  const playSound = async () => {
    if (recordedUri) {
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      await sound.playAsync();
    }
  };

  const detectVoice = () => {
    const realPercentage = 80; // Example detection logic
    const fakePercentage = 20; // Example detection logic
    navigation.navigate('DetectionResult', {
      realPercentage,
      fakePercentage,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tagline}>Voice Recording Page</Text>
      <TouchableOpacity style={styles.recordButton} onPress={handleRecordPress}>
        <Text style={styles.buttonText}>{isRecording ? (isPaused ? 'Resume' : 'Stop') : 'Record'}</Text>
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
  recordButton: {
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

export default VoiceRecordingPage;
