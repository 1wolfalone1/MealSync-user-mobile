import React from 'react';
import { FlatList, View } from 'react-native';
import ItemPromotionInShop from './ItemPromotionInShop';

const listEmpty = new Array(5).fill(null);
const ListPromotionInShop = ({ listPromotion }) => {
  return (
    <View>
      <FlatList
        data={listPromotion ? listPromotion : listEmpty}
        contentContainerStyle={{ paddingHorizontal: 28 }}
        ItemSeparatorComponent={() => <View className="w-[16]" />}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <ItemPromotionInShop item={item} />}
        horizontal
      />
    </View>
  );
};

export default ListPromotionInShop;
