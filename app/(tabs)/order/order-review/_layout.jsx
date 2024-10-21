import React from 'react';
import { JsStack } from '../../../../components/custom-stack/JsStack';

const Layout = () => {
  return (
    <JsStack
      screenOptions={{ animation: 'slide_from_bottom', headerShown: false }}
    >
      <JsStack.Screen
        name="index"
        options={{
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
    </JsStack>
  );
};

export default Layout;
