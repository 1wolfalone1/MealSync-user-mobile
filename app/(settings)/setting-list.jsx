import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { Contact, LogOut } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { Divider, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import HeaderSimple from '../../components/common/HeaderSimple';
import AvatarChange from '../../components/setting/AvatarChange';
import colors from '../../constant/colors';

const SettingsLayout = () => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <HeaderSimple title={'Cài đặt'} />

      <View>
        <AvatarChange />
        <View>
          <TouchableRipple onPress={() => router.push('/user')}>
            <View className="flex-row gap-4 items-center p-2 pl-5">
              <Contact size={30} color={colors.primaryBackgroundColor} />
              <Text className="text-lg text-primary">Thay đổi thông tin</Text>
            </View>
          </TouchableRipple>
          <Divider className="w-full" style={{ height: 1 }} />
     
          <Divider className="w-full" style={{ height: 1 }} />
          <TouchableRipple
            onPress={async () => {
              try {
                const a = await auth().signOut();
                console.log(a, ' sign out ------------------------------');

                await AsyncStorage.setItem('@token', '');
                await AsyncStorage.setItem('@statusLogin', '');
              } catch (e) {
                const a = await auth().signOut();
                console.log(a, ' sign out ------------------------------');

                await AsyncStorage.setItem('@token', '');
                await AsyncStorage.setItem('@statusLogin', '');
              }
              router.push('/sign-in');
            }}
          >
            <View className="flex-row gap-4 items-center p-2 pl-5">
              <LogOut size={30} color={colors.primaryBackgroundColor} />
              <Text className="text-lg text-primary">Đăng xuất</Text>
            </View>
          </TouchableRipple>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsLayout;
