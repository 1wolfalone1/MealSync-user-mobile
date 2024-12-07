import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import api from "../../../api/api";
import ItemInGridSearch from "../../../components/user-page/ItemInGridSearch";

const SearchPage = () => {
  const [dataPromtProduct, setDataPromtProduct] = useState(null);
  const handleGetDataPromtProduct = async () => {
    try {
      const res = await api.get("/api/v1/food/top?pageIndex=1&pageSize=20");
      const data = await res.data;
      console.log(data, " data ItemSearch");
      setDataPromtProduct(data.value.items);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    handleGetDataPromtProduct();
  }, []);
  const blankList = Array(12).fill(null);
  return (
    <View className="mt-6">
      <ScrollView className="overflow-visible">
        {/*             <View className="flex-1 mb-8">
          <View className="mb-8 pl-7">
            <Text className="font-hnow65medium text-lg">Tìm kiếm gần đây</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className=""
          >
            <View className="flex-row gap-2 pl-7">
              {dataRecentSearch &&
                dataRecentSearch.map((item, index) => (
                  <View
                    key={item.id}
                    className="bg-gray-200 p-1 min-w-[50] justify-center items-center rounded-2xl"
                  >
                    <Text className="font-font-hnow63book text-gray-500 text-sm">
                      {item.name}
                    </Text>
                  </View>
                ))}
            </View>
          </ScrollView>
        </View>
 */}
        <View className="mb-3 ml-7 mb-8">
          <Text className="font-hnow65medium text-lg">Được đề xuất</Text>
        </View>
        <View className="flex-row flex-wrap bg-transparent">
          <FlatList
            contentContainerStyle={{ paddingLeft: 28 }}
            data={dataPromtProduct ? dataPromtProduct : blankList}
            scrollEnabled={false}
            numColumns={3}
            renderItem={({ item }) => <ItemInGridSearch item={item} />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchPage;
