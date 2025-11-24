import { Routes } from './Routes';
import { ResultType } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  [Routes.Home]: undefined;
  [Routes.REFERENCE]: undefined;
  [Routes.CAMERA]: {
    captureMode: 'default' | 'custom';
    customReferenceUri?: string | null;
  };
  [Routes.RESULT]: {
    result: ResultType;
    similarity: number;
  };
};

export type ResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  Routes.RESULT
>;

export type CameraScreenProps = NativeStackScreenProps<
  RootStackParamList,
  Routes.CAMERA
>;
