import { Routes } from './Routes';
import { ResultType } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  [Routes.Home]: undefined;
  [Routes.CAMERA]: undefined;
  [Routes.RESULT]: {
    result: ResultType;
    similarity: number;
  };
};

export type ResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  Routes.RESULT
>;