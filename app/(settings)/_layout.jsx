import { TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import { JsStack } from '../../components/custom-stack/JsStack';
import colors from '../../constant/colors';

const UserLayout = () => {
  return (
    <JsStack screenOptions={{ animation: 'slide_from_bottom' }}>
      <JsStack.Screen name="setting-list" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
      <JsStack.Screen name="user" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
      <JsStack.Screen name="upgrade-shop" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
      <JsStack.Screen name='waiting-upgrade-accept' options={{ headerShown: true,
      title: 'Chờ xác nhận từ hệ thống',
      headerTitleStyle: { color: 'white' },
      headerBackTitleVisible: false,
      headerStyle: { backgroundColor: colors.primaryBackgroundColor},
      headerTintColor: 'white',
        animation: 'slide_from_left' }} />
      <JsStack.Screen
        name="map"
        options={{
          headerShown: false,
          mode: 'model',
          gestureEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
    </JsStack>
  );
};

export default UserLayout;
