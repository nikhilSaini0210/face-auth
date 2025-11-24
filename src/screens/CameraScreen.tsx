import React, { FC, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { goBack, navigate } from '../utils/NavigationUtil';
import FaceRecognitionService from '../services/FaceRecognitionService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routes } from '../navigation/Routes';
import LoadingOverlay from '../components/LoadingOverlay';
import Icon from '../components/Icon';
import { CameraScreenProps } from '../navigation/RouteParams';

const REFERENCE_IMAGE = require('../assets/images/reference_face.png');

const CameraScreen: FC<CameraScreenProps> = ({ route }) => {
  const { captureMode, customReferenceUri } = route.params;
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef<Camera>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCapture = async (uri: string) => {
    setCapturedImage(uri);
    setIsProcessing(true);
    try {
      let referenceUri = customReferenceUri;
      if (captureMode === 'default') {
        const referenceSource = Image.resolveAssetSource(REFERENCE_IMAGE);
        referenceUri = referenceSource?.uri ?? REFERENCE_IMAGE;
      } else {
        referenceUri = customReferenceUri || '';
      }

      const { match, similarity: score } =
        await FaceRecognitionService.compareFaces(uri, referenceUri);

      navigate(Routes.RESULT, {
        result: match ? 'success' : 'failed',
        similarity: score,
      });

      setCapturedImage(null);
    } catch (error) {
      console.error('Face recognition error:', error);
      navigate(Routes.RESULT, {
        result: 'failed',
        similarity: 0,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePhoto({
        flash: 'off',
      });
      onCapture(`file://${photo.path}`);
    } catch (error) {
      console.error('Capture error:', error);
      setIsCapturing(false);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Camera permission required</Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>No camera device found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
        />

        <View style={styles.overlay}>
          <View style={styles.guideContainer}>
            <View style={styles.faceOutline}>
              {capturedImage ? (
                <Image
                  source={{ uri: capturedImage }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : null}
            </View>
            <Text style={styles.guideText}>
              Position your face in the frame
            </Text>
          </View>

          <View style={styles.captureButtonContainer}>
            <TouchableOpacity
              style={[
                styles.captureButton,
                isCapturing && styles.captureButtonDisabled,
              ]}
              onPress={handleCapture}
              disabled={isCapturing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon
            iconFamily="Ionicons"
            name="arrow-back"
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>

      <LoadingOverlay
        visible={isProcessing}
        message="Analyzing face... Please wait"
      />
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 100,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    alignSelf: 'flex-start',
    position: 'absolute',
    top: 35,
    left: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 125,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  guideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  faceOutline: {
    width: 250,
    height: 300,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  guideText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  captureButtonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#4CAF50',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CAF50',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraScreen;
