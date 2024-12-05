import { Stack } from 'expo-router';
import React from 'react';
import colors from '../../../constant/colors';

const NotifyLayout = () => {
  return (
    <Stack screenOptions={{ animation: 'slide_from_bottom' }}>
      <Stack.Screen
        name="index"
        options={{
          animation: 'fade_from_bottom',
          headerTitle: 'Thông báo',
          headerTitleAlign: 'center',
          headerBlurEffect: "regular",
          headerStyle: {
            backgroundColor: '#fffbfbeb',
          },
          headerTitleStyle: {
            color: colors.primaryBackgroundColor
          },
          headerSearchBarOptions: {
            placeholder: 'Tìm kiếm ...',
          },
          headerBackButtonMenuEnabled: false,
          
        }}
      />
    </Stack>
  );
};

export default NotifyLayout;
