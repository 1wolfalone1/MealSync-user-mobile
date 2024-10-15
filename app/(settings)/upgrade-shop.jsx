import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/api';
import HeaderSimple from '../../components/common/HeaderSimple';
import ImageChangeInUpgradeToShop from '../../components/setting/ImageChangeInUpgradeToShop';
import UpgradeToShopForm from '../../components/setting/UpgradeToShopForm';
import { Colors } from '../../constant';
import globalSlice, { globalSelector } from '../../redux/slice/globalSlice';

const UpgradeShop = () => {
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const dispatch = useDispatch()

  const { map } = useSelector(globalSelector);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('LogoFile', {
        uri: logo,
        type: 'image/*',
        name: 'logo',
      });
      formData.append('BannerFile', {
        uri: banner,
        type: 'image/*',
        name: 'banner',
      });
      console.log(
        values,
        map.origin,
        ' dataaaaaaaaaaaaaaaaaaaaaaa',
        'logo',
        'banner',
        banner,
        logo,
      );
      Object.keys(values).forEach((key) => formData.append(key, values[key]));
      formData.append('BuildingName', map.origin.name);
      formData.append('Latitude', map.origin.latitude);
      formData.append('Longitude', map.origin.longitude);
      const res = await api.put('/api/v1/customer/account/update-to-shop', formData, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      });
      const data = await res.data;
      console.log(data);
      if (data.isSuccess) {
        dispatch(
          globalSlice.actions.customSnackBar({
            style: {
              color: 'white',
              backgroundColor: Colors.glass.green,
              pos: {
                top: 40,
              },
              actionColor: 'yellow',
            },
          }),
        );
        dispatch(
          globalSlice.actions.openSnackBar({ message: 'Nâng cấp thành cửa hàng thành công <3' }),
        );
        router.replace('/waiting-upgrade-accept')
      } else {
        dispatch(
          globalSlice.actions.customSnackBar({
            style: {
              color: 'white',
              backgroundColor: Colors.glass.red,
              pos: {
                top: 40,
              },
              actionColor: 'yellow',
            },
          }),
        );
        dispatch(
          globalSlice.actions.openSnackBar({
            message:
              'Không thể nâng cấp lên cửa hàng do có thông tin không phù hợp!! Vui lòng thử lại sau :_)',
          }),
        );
      }
    } catch (err) {
      console.error(err, 'Error 304');
      dispatch(
        globalSlice.actions.customSnackBar({
          style: {
            color: 'white',
            backgroundColor: Colors.glass.red,
            pos: {
              top: 40,
            },
            actionColor: 'yellow',
          },
        }),
      );
      dispatch(
        globalSlice.actions.openSnackBar({
          message: 'Không thể  nâng cấp lên shop! Làm ơn thử lại sau :_)',
        }),
      );
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <HeaderSimple title={' Nâng cấp thành cửa hàng'} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ImageChangeInUpgradeToShop
          logo={logo}
          setLogo={setLogo}
          banner={banner}
          setBanner={setBanner}
        />
        <UpgradeToShopForm handleSubmit={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpgradeShop;
