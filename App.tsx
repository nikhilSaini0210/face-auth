import React, { useState } from 'react';
import { StatusBar, StyleSheet, Image } from 'react-native';
import { ResultType, Screen } from './src/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import ResultScreen from './src/screens/ResultScreen';
import LoadingOverlay from './src/components/LoadingOverlay';
import FaceRecognitionService from './src/services/FaceRecognitionService';

const REFERENCE_IMAGE = require('./src/assets/images/reference_face.jpg');

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<ResultType>(null);
  const [similarity, setSimilarity] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartAuth = () => {
    setCurrentScreen('camera');
  };

  const handleCapture = async (uri: string) => {
    setCapturedImage(uri);
    setIsProcessing(true);

    try {
      const referenceSource = Image.resolveAssetSource(REFERENCE_IMAGE);

      const referenceUri = referenceSource?.uri ?? REFERENCE_IMAGE;

      const { match, similarity: score } =
        await FaceRecognitionService.compareFaces(uri, referenceUri);

      setSimilarity(score);
      setResult(match ? 'success' : 'failed');
      setCurrentScreen('result');
    } catch (error) {
      console.error('Face recognition error:', error);
      setSimilarity(0);
      setResult('failed');
      setCurrentScreen('result');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setCapturedImage(null);
    setResult(null);
    setSimilarity(0);
    setCurrentScreen('camera');
  };

  const handleHome = () => {
    setCapturedImage(null);
    setResult(null);
    setSimilarity(0);
    setCurrentScreen('home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {currentScreen === 'home' && <HomeScreen onStartAuth={handleStartAuth} />}

      {currentScreen === 'camera' && (
        <CameraScreen onCapture={handleCapture} onBack={handleHome} />
      )}

      {currentScreen === 'result' && (
        <ResultScreen
          result={result}
          similarity={similarity}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}

      <LoadingOverlay
        visible={isProcessing}
        message="Analyzing face... Please wait"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default App;
