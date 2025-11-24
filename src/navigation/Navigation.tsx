import { StatusBar } from 'react-native';
import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from '../utils/NavigationUtil';
import { Routes } from './Routes';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import { RootStackParamList } from './RouteParams';
import ResultScreen from '../screens/ResultScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        backgroundColor={'#F5F5F5'}
        barStyle="dark-content"
        translucent={false}
      />
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={Routes.Home}
      >
        <Stack.Screen name={Routes.Home} component={HomeScreen} />
        <Stack.Screen name={Routes.CAMERA} component={CameraScreen} />
        <Stack.Screen name={Routes.RESULT} component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
