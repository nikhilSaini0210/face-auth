import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate } from '../utils/NavigationUtil';
import { Routes } from '../navigation/Routes';
import Icon from '../components/Icon';

const HomeScreen: FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
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
            <Icon
              iconFamily="Ionicons"
              name="checkbox"
              color="#4CAF50"
              size={36}
            />
            <Text style={styles.featureText}>Instant verification</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title="Start Face Authentication"
            onPress={() => navigate(Routes.REFERENCE)}
          />
        </View>
      </View>
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
  },
  featureText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 15,
  },
  footer: {
    padding: 20,
  },
});

export default HomeScreen;
