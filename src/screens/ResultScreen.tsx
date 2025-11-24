import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { Routes } from '../navigation/Routes';
import { goBack, resetAndNavigate } from '../utils/NavigationUtil';
import { ResultScreenProps } from '../navigation/RouteParams';
import Icon from '../components/Icon';

const ResultScreen: FC<ResultScreenProps> = ({ route }) => {
  const { result, similarity } = route.params;

  const isSuccess = result === 'success';

  const handleRetry = () => {
    goBack();
  };

  const handleHome = () => {
    resetAndNavigate(Routes.Home);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.icon]}>
          <Icon
            iconFamily="Ionicons"
            name={isSuccess ? 'checkmark-circle' : 'close-circle'}
            color={isSuccess ? '#4CAF50' : '#F44336'}
            size={100}
          />
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
            <View>
              <View style={styles.detailContainer}>
                <Icon
                  iconFamily="Ionicons"
                  name="checkbox"
                  color="#4CAF50"
                  size={24}
                />
                <Text style={styles.detailText}>Face detected</Text>
              </View>
              <View style={styles.detailContainer}>
                <Icon
                  iconFamily="Ionicons"
                  name="checkbox"
                  color="#4CAF50"
                  size={24}
                />
                <Text style={styles.detailText}>Features extracted</Text>
              </View>
              <View style={styles.detailContainer}>
                <Icon
                  iconFamily="Ionicons"
                  name="checkbox"
                  color="#4CAF50"
                  size={24}
                />
                <Text style={styles.detailText}>Match confirmed</Text>
              </View>
            </View>
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
            onPress={handleRetry}
            variant="secondary"
            style={styles.retryButton}
          />
        )}
        <PrimaryButton title="Back to Home" onPress={handleHome} />
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
    width: '100%',
    marginTop: 10,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 4,
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
