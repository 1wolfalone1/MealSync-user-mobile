import React from 'react';
import { FlatList, View } from 'react-native';
import ItemBestProctInShop from './ItemBestProctInShop';

const emptyList = new Array(4).fill(null)
const ListBestProductInShop = ({ data }) => {
  return (
    <View>
      <FlatList
        data={data ? data : emptyList}
        contentContainerStyle={{ paddingHorizontal: 28 }}
        renderItem={({ item }) => <ItemBestProctInShop item={item} />}
        horizontal
        ItemSeparatorComponent={() => <View className="w-[16]" />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default ListBestProductInShop;
