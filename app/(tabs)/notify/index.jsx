import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Divider } from 'react-native-paper';
import api from '../../../api/api';
import ItemInPageNotify from '../../../components/notify/ItemInPageNotify';

const emptyList = new Array(4).fill(null);
const NotifyIndex = () => {
  const [data, setData] = useState(null);
  const getNoti = async () => {
    try {
      const res = await api.get('/api/v1/customer/notification')
      const data = await res.data;
      setData(data.value.items);
    } catch(e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getNoti();
  }, [])
  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={data ? data : emptyList}
        contentContainerStyle={{}}
        renderItem={({ item }) => <ItemInPageNotify item={item} />}
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
    </View>
  );
};

export default NotifyIndex;

const data = [
  {
    id: 1,
    title: 'Shop noti',
    body: 'Bạn đã nhận được 1 đơn hàng mới',
    image: 'https://pbs.twimg.com/profile_images/554798224154701824/mWd3laxO_400x400.png',
    createAt: 'now'
  },
  {
    id: 2,
    title: 'Shop noti',
    body: 'Bạn đã nhận được 1 đơn hàng mới',
    image: 'https://pbs.twimg.com/media/EXrLZdWWoAE8HkE.png',
    createAt: '19:03'
  },
  {
    id: 3,
    title: 'Shop noti',
    body: 'Bạn đã nhận được 1 đơn hàng mới',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcrvFbkVZKVkQUXmQsWKnPtWYYZCGEuAbCjw&s',
    createAt: '23/06/2024 19:03'
  },
  {
    id: 4,
    title: 'Shop noti',
    body: 'Bạn đã nhận được 1 đơn hàng mới',
    image:
      'https://www.pngitem.com/pimgs/m/424-4242818_golang-logo-golang-gopher-hd-png-download.png',
    createAt: '20/06/2024 2:32'
  },
  {
    id: 5,
    title: 'Shop noti',
    body: 'Bạn đã nhận được 1 đơn hàng mới',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDHqzEv4reHgi8FXD6sZsDjoPbxqFUjOSe6b3xnP_USkrEmLdcVmL_afCjI8knHl8OtJ0&usqp=CAU',
    createAt: '19/06/2024 2:19'
  },
  {
    id: 6,
    title: 'Shop noti asdf',
    body: 'Bạn đã nhận được 1 đơn hàng mới',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDHqzEv4reHgi8FXD6sZsDjoPbxqFUjOSe6b3xnP_USkrEmLdcVmL_afCjI8knHl8OtJ0&usqp=CAU',
    createAt: '20/06/2024 2:32'
  },
  {
    id: 7,
    title: 'Shop noti',
    body: 'Bạn đã nhận được 1 đơn hàng mới',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDHqzEv4reHgi8FXD6sZsDjoPbxqFUjOSe6b3xnP_USkrEmLdcVmL_afCjI8knHl8OtJ0&usqp=CAU',
    createAt: '20/06/2024 2:32'
  },
  
  {
    id: 8,
    title: 'Shop noti',
    body: 'Bạn đã nhận được 1 đơn hàng mới',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDHqzEv4reHgi8FXD6sZsDjoPbxqFUjOSe6b3xnP_USkrEmLdcVmL_afCjI8knHl8OtJ0&usqp=CAU',
    createAt: '20/06/2024 2:32'
  },
];
