import React from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingOverlayProps {
  visible: boolean;
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    gap: 15,
    minWidth: 200,
  },
  text: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LoadingOverlay;
