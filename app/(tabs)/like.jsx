import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, View } from "react-native";
import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api/api";
import HeaderCustom from "../../components/common/HeaderCustom";
import ShopLikeItem from "../../components/like/ShopLikeItem";

const Settings = () => {
  const isFocus = useIsFocused();
  const [listLikeShop, setListLikeShop] = useState([]);
  console.log(isFocus, " is focus");
  useEffect(() => {
    handleGetListLikeShop();
  }, [isFocus]);
  const handleGetListLikeShop = async () => {
    try {
      const res = await api.get(
        "/api/v1/shop/favourite?pageIndex=1&pageSize=10"
      );
      const data = await res.data;
      console.log(data);
      setListLikeShop(data.value.items);
    } catch (e) {
      console.log(e);
    }
  };
  console.log(listLikeShop);
  const { width, height } = Dimensions.get("screen");
  const widthItem = (width * 90) / 100;
  const emptyList = new Array(5).fill(null);
  return (
    <SafeAreaView className="bg-white flex-1" edges={["bottom"]}>
      <HeaderCustom title={"Cửa hàng yêu thích"} />
      {listLikeShop.length > 0 ? (
        <View className="flex-1 items-center">
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
            data={listLikeShop ? listLikeShop : emptyList}
            renderItem={({ item }) => <ShopLikeItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={() => <Divider />}
          />
        </View>
      ) : (
        <View className="flex-1 items-center mt-8">
          <Image
            style={{
              width: widthItem,
              height: widthItem,
            }}
            source={{
              uri: "https://mealsync.s3.ap-southeast-1.amazonaws.com/image/1733499930721-ce551924-183a-4607-81ca-38e894f8f0b7.png",
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Settings;
