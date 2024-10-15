import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import HeaderSimple from '../../components/common/HeaderSimple';
import AvatarChange from '../../components/setting/AvatarChange';
import UserFormInfo from '../../components/setting/UserFormInfo';
import { userInfoSliceSelector } from '../../redux/slice/userSlice';

const UserProfile = () => {
  const userInfo = useSelector(userInfoSliceSelector);
  console.log(userInfo, 'user info');
  return (
    <SafeAreaView className="flex-1 bg-white">
      <HeaderSimple title={'Thông tin cá nhân'} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AvatarChange />
        <UserFormInfo />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;
