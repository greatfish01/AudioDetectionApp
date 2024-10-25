// DetectionResultPage.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import color from '../misc/color';

const DetectionResultPage = ({ route, navigation }) => {
  const { realPercentage, fakePercentage } = route.params;

  const isRealVoice = realPercentage > fakePercentage;
  const voiceType = isRealVoice ? 'REAL VOICE' : 'FAKE VOICE';

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>{voiceType}</Text>
      <View style={styles.boxContainer}>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>REAL</Text>
          <Text style={styles.boxPercentage}>{realPercentage}%</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>FAKE</Text>
          <Text style={styles.boxPercentage}>{fakePercentage}%</Text>
        </View>
      </View>
      <Text style={styles.checkVoiceText}>Please check your other voice</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
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
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  box: {
    width: '40%',
    padding: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    alignItems: 'center',
  },
  boxTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  boxPercentage: {
    fontSize: 20,
    marginTop: 10,
  },
  checkVoiceText: {
    fontSize: 18,
    marginVertical: 10,
  },
  backButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DetectionResultPage;
