import { router } from "expo-router";
import { Info } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button, Divider } from "react-native-paper";
import { useSelector } from "react-redux";
import api from "../../api/api";
import { orderSelector } from "../../redux/slice/orderSlice";

const OrderInfoViewInCart = ({ userInfo, info }) => {
  const { orderInfo } = useSelector(orderSelector);

  const [listBuilding, setListBuilding] = useState([]);
  const [selectBuilding, setSelectBuilding] = useState("");
  const handleGetListBuilding = async () => {
    try {
      const res = await api.get("/api/v1/customer/building");
      const data = await res.data;
      const list = data.value;
      console.log(list);
      if(list && Array.isArray(list)){
        const item = list.find(i => i.buildingId == orderInfo.buildingId)
        console.log(item, orderInfo, ' dsfasfdasssssss')
        setSelectBuilding(item.buildingName)
      }
    } catch (e) {
      console.log("Get list building error: ", e);
    }
  };
  useEffect(() => {
    handleGetListBuilding();
  }, [orderInfo]);
  return (
    <View className="mb-5 pl-8">
      <View className="flex-row items-center ">
        <View className="flex-row items-center">
          <Info color={"green"} size={28} />
          <Text className="ml-2 text-lg font-bold">Thông tin giao hàng</Text>
        </View>
        <View>
          <Button onPress={() => router.push("/shop/change-info")}>
            Thay đổi
          </Button>
        </View>
      </View>
      <View className="ml-2">
        <View className="flex-row items-center mt-2">
          <Text className="font-hnow64regular text-gray-600">
            {orderInfo.fullName}
          </Text>
          <Divider
            className="h-full "
            style={{
              width: 1,
              marginHorizontal: 20,
            }}
          />
          <Text className="font-hnow64regular text-gray-600">
            {orderInfo.phoneNumber}
          </Text>
        </View>
        <View className="mt-2 ">
          <Text className="font-hnow64regular text-gray-700">
            {selectBuilding}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderInfoViewInCart;
