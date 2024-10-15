import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { Colors, Icons } from "../../constant";
const HeaderInAuth = ({ }) => {
  const [activePage, setActivePage] = useState("signIn")
  return (
    <View
      className="bg-primary h-[35%] rounded-b-3xl flex-col justify-end items-center space-10"
      style={styles.shadow}
    >
      <View className="flex-1 justify-center items-center">
        <Image source={Icons.IconLight} />
      </View>
      <View className="flex-row justify-between w-full gap-5 pr-4  pl-4">
        <View className={`${activePage === 'signIn' ? 'border-b-2 border-b-white' : ''} w-[40%]`}>
          <Button
            mode="text"
            textColor={Colors.commonBtnText}
            theme={{ roundness: 0 }}
            contentStyle={{
              paddingVertical: 8,
              width: '90%',
            }}
            labelStyle={{
              fontFamily: 'HeadingNow-64Regular',
              fontSize: 16,
              lineHeight: 18,
            }}
            onPress={() => {
              if (activePage === 'signIn') {
                return;
              }
              setActivePage('signIn');
              router.push('/sign-in');
            }}
          >
            Đăng nhập
          </Button>
        </View>
        <View className={`${activePage === 'signUp' ? 'border-b-2 border-b-white' : ''} w-[40%]`}>
          <Button
            mode="text"
            textColor={Colors.commonBtnText}
            theme={{ roundness: 0 }}
            contentStyle={{
              paddingVertical: 8,
              width: '90%',
            }}
            labelStyle={{
              fontFamily: 'HeadingNow-64Regular',
              fontSize: 16,
              lineHeight: 18,
            }}
            onPress={() => {
              if (activePage === 'signUp') {
                return;
              }
              setActivePage('signUp');
              router.push('/sign-in/sign-up');
            }}
          >
            <Text>Đăng ký</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default HeaderInAuth;
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#302f2f',
    shadowOffset: {
      width: 4,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,

    elevation: 10,
  },
});
