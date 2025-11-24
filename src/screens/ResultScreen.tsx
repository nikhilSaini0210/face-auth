import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { ResultType } from '../types';

interface ResultScreenProps {
  result: ResultType;
  similarity: number;
  onRetry: () => void;
  onHome: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  similarity,
  onRetry,
  onHome,
}) => {
  const isSuccess = result === 'success';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          style={[
            styles.icon,
            isSuccess ? styles.successIcon : styles.failedIcon,
          ]}
        >
          <Text style={styles.iconText}>{isSuccess ? '✓' : '✕'}</Text>
        </View>

        <Text style={styles.title}>
          {isSuccess
            ? 'Face Verified Successfully'
            : 'Face Verification Failed'}
        </Text>

        <Text style={styles.subtitle}>
          Match Score: {(similarity * 100).toFixed(1)}%
        </Text>

        <View style={styles.details}>
          {isSuccess ? (
            <>
              <Text style={styles.detailText}>✅ Face detected</Text>
              <Text style={styles.detailText}>✅ Features extracted</Text>
              <Text style={styles.detailText}>✅ Match confirmed</Text>
            </>
          ) : (
            <>
              <Text style={styles.detailText}>⚠️ Face mismatch detected</Text>
              <Text style={styles.detailText}>
                Please try again with better lighting
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        {!isSuccess && (
          <PrimaryButton
            title="Try Again"
            onPress={onRetry}
            variant="secondary"
            style={styles.retryButton}
          />
        )}
        <PrimaryButton title="Back to Home" onPress={onHome} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  successIcon: {
    backgroundColor: '#4CAF50',
  },
  failedIcon: {
    backgroundColor: '#F44336',
  },
  iconText: {
    fontSize: 60,
    color: '#FFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  details: {
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    gap: 12,
  },
  retryButton: {
    marginBottom: 8,
  },
});

export default ResultScreen;
