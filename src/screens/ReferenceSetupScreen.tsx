import React, { FC, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate, goBack } from '../utils/NavigationUtil';
import { Routes } from '../navigation/Routes';
import Icon from '../components/Icon';
import PrimaryButton from '../components/PrimaryButton';
import CameraModal from '../components/CameraModal';

const REFERENCE_IMAGE = require('../assets/images/reference_face.png');

const ReferenceSetupScreen: FC = () => {
  const [customReferenceUri, setCustomReferenceUri] = useState<string | null>(
    null,
  );
  const [selectedMode, setSelectedMode] = useState<'default' | 'custom' | null>(
    null,
  );
  const [cameraVisible, setCameraVisible] = useState(false);

  const handleCaptureReference = () => {
    setCameraVisible(true);
  };

  const handleUseDefault = () => {
    setSelectedMode('default');
  };

  const onCapture = (uri: string) => {
    setCustomReferenceUri(uri);
    setSelectedMode('custom');
    setCameraVisible(false);
  };

  const handleProceedToVerification = () => {
    if (!selectedMode) {
      Alert.alert(
        'Selection Required',
        'Please select a reference image option to continue.',
        [{ text: 'OK' }],
      );
      return;
    }

    navigate(Routes.CAMERA, {
      captureMode: selectedMode,
      customReferenceUri: selectedMode === 'custom' ? customReferenceUri : null,
    });
  };

  const handleRetakeReference = () => {
    Alert.alert(
      'Retake Reference',
      'Do you want to capture a new reference image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Retake',
          onPress: handleCaptureReference,
        },
      ],
    );
  };

  const handleClearReference = () => {
    Alert.alert(
      'Clear Reference',
      'Are you sure you want to clear the custom reference image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setCustomReferenceUri(null);
            setSelectedMode(null);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Icon
              iconFamily="Ionicons"
              name="arrow-back"
              size={24}
              color="#333"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reference Setup</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.instructionsCard}>
          <Icon
            iconFamily="Ionicons"
            name="information-circle"
            size={24}
            color="#4CAF50"
          />
          <Text style={styles.instructionsText}>
            Choose a reference image for face verification. You can use the
            default image or capture your own.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.optionCard,
            selectedMode === 'default' && styles.optionCardSelected,
          ]}
          onPress={handleUseDefault}
        >
          <View style={styles.optionHeader}>
            <View style={styles.radioButton}>
              {selectedMode === 'default' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <Text style={styles.optionTitle}>Use Default Reference</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={REFERENCE_IMAGE}
              style={styles.referenceImage}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.optionDescription}>
            Use the pre-configured reference image for verification
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.optionCard,
            selectedMode === 'custom' && styles.optionCardSelected,
          ]}
        >
          <View style={styles.optionHeader}>
            <View style={styles.radioButton}>
              {selectedMode === 'custom' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <Text style={styles.optionTitle}>Capture Custom Reference</Text>
          </View>

          {customReferenceUri ? (
            <>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: customReferenceUri }}
                  style={styles.referenceImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <Icon
                    iconFamily="Ionicons"
                    name="checkmark-circle"
                    size={40}
                    color="#4CAF50"
                  />
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleRetakeReference}
                >
                  <Icon
                    iconFamily="Ionicons"
                    name="camera"
                    size={20}
                    color="#4CAF50"
                  />
                  <Text style={styles.secondaryButtonText}>Retake</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleClearReference}
                >
                  <Icon
                    iconFamily="Ionicons"
                    name="trash-outline"
                    size={20}
                    color="#F44336"
                  />
                  <Text style={[styles.secondaryButtonText, styles.bgcolor]}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCaptureReference}
              >
                <Icon
                  iconFamily="Ionicons"
                  name="camera"
                  size={48}
                  color="#4CAF50"
                />
                <Text style={styles.captureButtonText}>Tap to Capture</Text>
              </TouchableOpacity>

              <Text style={styles.optionDescription}>
                Capture your own face as reference for verification
              </Text>
            </>
          )}
        </View>

        {selectedMode && (
          <View style={styles.selectionInfo}>
            <Icon
              iconFamily="Ionicons"
              name="checkmark-circle"
              size={20}
              color="#4CAF50"
            />
            <Text style={styles.selectionInfoText}>
              {selectedMode === 'default'
                ? 'Default reference selected'
                : 'Custom reference captured'}
            </Text>
          </View>
        )}

        <View style={styles.proceedButtonContainer}>
          <PrimaryButton
            title="Proceed to Verification"
            onPress={handleProceedToVerification}
            disabled={!selectedMode}
            style={styles.proceedButton}
          />
        </View>
      </ScrollView>

      <CameraModal
        cameraVisible={cameraVisible}
        onClose={() => {
          setCameraVisible(false);
          setCustomReferenceUri(null);
          setSelectedMode(null);
        }}
        onCapture={onCapture}
      />
    </SafeAreaView>
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
  content: {
    padding: 20,
  },
  bgcolor: { color: '#F44336' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  instructionsCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  instructionsText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  optionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8F4',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#E0E0E0',
    position: 'relative',
  },
  referenceImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 4,
  },
  captureButton: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#4CAF50',
    marginBottom: 12,
  },
  captureButtonText: {
    marginTop: 8,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  secondaryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectionInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  proceedButtonContainer: {
    marginBottom: 20,
  },
  proceedButton: {
    width: '100%',
  },
});

export default ReferenceSetupScreen;
