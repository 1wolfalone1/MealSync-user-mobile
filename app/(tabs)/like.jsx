import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api/api';
import HeaderCustom from '../../components/common/HeaderCustom';
import ShopLikeItem from '../../components/like/ShopLikeItem';

const Settings = () => {
  const isFocus = useIsFocused();
  const [listLikeShop, setListLikeShop] = useState([]);
  console.log(isFocus, ' is focus');
  useEffect(() => {
    if (isFocus) {
      handleGetListLikeShop();
    }
  }, [isFocus]);
  const handleGetListLikeShop = async () => {
    try {
      const res = await api.get('/api/v1/shop/favourite?pageIndex=1&pageSize=10');
      const data = await res.data;
      console.log(data);
      setListLikeShop(data.value.items);
    } catch (e) {
      console.log(e);
    }
  };

  const emptyList = new Array(5).fill(null);
  return (
    <SafeAreaView className="bg-white flex-1" edges={['bottom']}>
      <HeaderCustom title={'Cửa hàng yêu thích'} />
      <FlatList
        data={listLikeShop ? listLikeShop : emptyList}
        contentContainerStyle={{
          alignItems: 'center',
          marginTop: 50,
          paddingBottom: 100
        }}
        renderItem={({ item }) => <ShopLikeItem item={item} />}
        ItemSeparatorComponent={() => (
          <Divider
            style={{
              width: '100%',
              height: 2,
              backgroundColor: '#dfdfdf',
            }}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Settings;
