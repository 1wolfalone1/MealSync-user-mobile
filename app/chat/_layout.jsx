import { router, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { TouchableRipple } from 'react-native-paper';
import { Colors } from '../../constant';
const ChatLayout = () => {
 
  return (
    <Stack screenOptions={{ animation: 'slide_from_bottom' }}>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: Colors.primaryBackgroundColor,
          },
          headerBackTitleStyle: {
            color: '#fff',
          },
          headerTitle: 'Tin nhắn',
          headerTitleStyle: {
            color: '#fff',
          },
          headerBackButtonMenuEnabled: true,
          headerLeft: () => {
            return (
              <TouchableRipple
                onPress={() => router.back()}
                borderless
                className="rounded-full items-center justify-center p-4"
              >
                <ArrowLeft size={24} color={'white'} strokeWidth={2} />
              </TouchableRipple>
            );
          },
        }}
      />
      <Stack.Screen name="[id]" options={{ animation: 'slide_from_bottom', headerShown: false }} />
    </Stack>
  );
};

export default ChatLayout;
