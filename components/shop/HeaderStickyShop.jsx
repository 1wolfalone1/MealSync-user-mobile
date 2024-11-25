import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import api from '../../api/api';
import { Colors } from '../../constant';
import shopDetailsSlice from '../../redux/slice/shopDetailsSlice';

const HeaderStickyShop = ({ shopInfo, isHeaderTop, shopName, heightHeaderSticky }) => {
  const { width, height } = Dimensions.get('window');
  const dispatch = useDispatch();
  const handleFavouriteShop = async () => {
    try {
      const res = await api.put('/api/v1/customer/favourite/shop', {
        shopId: shopInfo?.id,
      });
      const data = await res.data;
      if (data.isSuccess) {
        dispatch(shopDetailsSlice.actions.toggleFavouriteShop());
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View
      className="flex-row items-center justify-between absolute top-0  z-1000 mt-8"
      style={{ width: width, height: heightHeaderSticky, zIndex: 1000 }}
    >
      <View className="flex-row items-center" style={{ width: (width * 70) / 100 }}>
        <IconButton
          icon="chevron-left"
          mode="contained-tonal"
          iconColor={Colors.primaryBackgroundColor}
          containerColor={!isHeaderTop ? Colors.glassShopHeader : 'transparent'}
          size={40}
          theme={{ padding: 5 }}
          onPress={() => {
            router.navigate('/home')
          }}
          className="p-0"
          style={{ borderRadius: 16 }}
        />
        <View>
          {isHeaderTop && (
            <Text numberOfLines={2} className="font-hnow65medium text-2xl text-ellipsis">
              {shopInfo?.name}
            </Text>
          )}
        </View>
      </View>
      <View className="flex-row">
        <IconButton
          icon="share-variant"
          iconColor={Colors.btnBackground}
          containerColor={Colors.primaryBackgroundColor}
          size={16}
          onPress={() => router.back()}
        />
        <IconButton
          icon="heart"
          iconColor={
            shopInfo?.isFavouriteShop ? Colors.btnBackground : Colors.primaryBackgroundColor
          }
          containerColor={
            !shopInfo?.isFavouriteShop ? Colors.btnBackground : Colors.primaryBackgroundColor
          }
          style={{
            borderRadius: 1000,
            borderWidth: 1,
            borderColor: Colors.primaryBackgroundColor,
          }}
          size={16}
          onPress={handleFavouriteShop}
        />
      </View>
    </View>
  );
};

export default HeaderStickyShop;
