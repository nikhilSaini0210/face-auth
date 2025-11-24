import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import Icon from './Icon';

interface CameraModalProps {
  cameraVisible: boolean;
  onCapture: (uri: string) => void;
  onClose: () => void;
}

const CameraModal: FC<CameraModalProps> = ({
  cameraVisible,
  onCapture,
  onClose,
}) => {
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef<Camera>(null);
  const [isCapturing, setIsCapturing] = useState(false);

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

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  return (
    <Modal
      visible={cameraVisible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        {device && (
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
        )}

        <View style={styles.overlay}>
          <View style={styles.guideContainer}>
            <View style={styles.faceOutline} />
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

        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Icon
            iconFamily="Ionicons"
            name="arrow-back"
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CameraModal;

const styles = StyleSheet.create({
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
    top: 20,
    left: 10,
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
});
