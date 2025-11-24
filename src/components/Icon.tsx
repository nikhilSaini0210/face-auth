import React, { FC } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { IconFamily } from '../types';

interface IconProps {
  color?: string;
  size: number;
  name: string;
  iconFamily: IconFamily;
}

const Icon: FC<IconProps> = ({ color, size, name, iconFamily }) => {
  return (
    <>
      {iconFamily === 'AntDesign' && (
        <AntDesign name={name} color={color} size={size} />
      )}
      {iconFamily === 'Ionicons' && (
        <Ionicons name={name} color={color} size={size} />
      )}
      {iconFamily === 'MaterialIcons' && (
        <MaterialIcons name={name} color={color} size={size} />
      )}
      {iconFamily === 'MaterialCommunityIcons' && (
        <MaterialCommunityIcons name={name} color={color} size={size} />
      )}
    </>
  );
};

export default Icon;
