import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { Colors } from '../../constant';

// eslint-disable-next-line react/prop-types
export default function HeaderInForgot({ back, title, des, email }) {
  return (
    <View className="pt-8 pl-2">
      <MaterialIcons
        name="arrow-back-ios-new"
        size={36}
        color={Colors.primaryBackgroundColor}
        onPress={() => {
          router.push({
            pathname: back, 
            params: {
              email: email
            },
          });
        }}
      />
      <View className="px-8 pt-40 pb-8 gap-2">
        <Text className="text-4xl font-bold">{title}</Text>
        <Text className="text-gray-500">{des}</Text>
      </View>
    </View>
  );
}
