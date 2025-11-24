import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';

interface HomeScreenProps {
  onStartAuth: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartAuth }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>🔐</Text>
        <Text style={styles.title}>Face Authentication</Text>
        <Text style={styles.title}>Demo</Text>
        <Text style={styles.subtitle}>
          Secure face-based authentication using custom recognition logic
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.featureContainer}>
          <Text style={styles.featureIcon}>📸</Text>
          <Text style={styles.featureText}>Capture your face</Text>
        </View>
        <View style={styles.featureContainer}>
          <Text style={styles.featureIcon}>🤖</Text>
          <Text style={styles.featureText}>AI-powered matching</Text>
        </View>
        <View style={styles.featureContainer}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>Instant verification</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title="Start Face Authentication"
          onPress={onStartAuth}
        />
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
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  featureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  featureText: {
    fontSize: 18,
    color: '#333',
  },
  footer: {
    padding: 20,
  },
});

export default HomeScreen;
