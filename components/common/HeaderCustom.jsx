import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constant';

const HeaderCustom = ({title}) => {
  return (
    <SafeAreaView className="bg-white pb-4 rounded-b-3xl" style={styles.shadow} edges={['top']}>
      <View className="flex-row justify-center items-center w-full ">
        <IconButton
          className="absolute left-0 "
          icon="chevron-left"
          size={32}
          iconColor={Colors.primaryBackgroundColor}
          onPress={() => router.back()}
        />
        <Text className="font-hnow64regular text-lg text-primary">{title}</Text>
      </View>
    </SafeAreaView>
  );
};

export default HeaderCustom;
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 2, height: 4 },
    shadowColor: Colors.shadow[300],

    shadowOpacity: 0.3,
    elevation: 10,
    // background color must be set
  },
  shadowSelected: {
    shadowOffset: { width: 8, height: 8 },
    shadowColor: Colors.shadow.DEFAULT,

    shadowOpacity: 0.6,

    elevation: 20,
    // background color must be set
  },
});