import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ShopItem from "../../components/cart-page/ShopItem";
import { Colors } from "../../constant";
import cartSlice, {
  cartSelector,
  getListShopInfo,
} from "../../redux/slice/cartSlice";
import { userInfoSliceSelector } from "../../redux/slice/userSlice";
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 2, height: 4 },
    shadowColor: Colors.shadow[300],

    shadowOpacity: 0.3,
    elevation: 10,
    // background color must be set
  },
  shadowSelected: {
    shadowOffset: { width: 8, height: 8 },
    shadowColor: Colors.shadow.DEFAULT,

    shadowOpacity: 0.6,

    elevation: 20,
    // background color must be set
  },
});

const CartPage = () => {
  const { listShopInfo } = useSelector(cartSelector);
  const userInfo = useSelector(userInfoSliceSelector);
  const { items } = useSelector(cartSelector);
  const dispatch = useDispatch();
  console.log(listShopInfo, " asdfasfasdfadsfasdfasdfasdfafsd", items);

  useEffect(() => {
    console.log(listShopInfo);
    dispatch(getListShopInfo());
    return () => {
      dispatch(cartSlice.actions.resetStateListShop());
    };
  }, [items]);
  return (
    <View className="bg-white flex-1 pb-120">
      <SafeAreaView
        className="bg-white pb-4 rounded-b-3xl"
        style={styles.shadow}
        edges={["top"]}
      >
        <View className="flex-row justify-center items-center w-full ">
          <Text className="font-hnow64regular text-lg text-primary">
            Bạn đang có sản phẩm trong giỏ hàng
          </Text>
        </View>
      </SafeAreaView>
      <View className="items-center m-5">
        <Text className="font-hnow65medium text-lg text-green-800">
          {userInfo?.building?.address}
        </Text>
      </View>
      <View className="flex-1  overflow-visible mx-5">
        {listShopInfo && listShopInfo.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            className="flex-1"
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 5,
                  width: "100%",
                  paddingVertical: 10,
                }}
              />
            )}
            data={listShopInfo}
            renderItem={({ item }) => <ShopItem item={item} />}
          />
        ) : (
          <View className="bg-white">
            <Image
              source={{
                uri: "https://mealsync.s3.ap-southeast-1.amazonaws.com/image/1733499568650-65d862df-cd2b-435c-8120-8ed63ddcc340.png",
              }}
              style={{ width: "100%", height: 500 }}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
      <StatusBar style="dark" />
    </View>
  );
};

export default CartPage;

const dataShop = [
  {
    id: 1,
    name: "The Green Leaf",
    shop: "Green Leaf Tea Emporium",
    avatar_link:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU",
    background_link:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg",
  },
  {
    id: 2,
    name: "Crafted Elegance",
    shop: "Elegant Crafts & Creations",
    avatar_link:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU",
    background_link:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg",
  },
  {
    id: 3,
    name: "Vintage Finds",
    shop: "Retro Relics Boutique",
    avatar_link:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU",
    background_link:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg",
  },
  {
    id: 4,
    name: "Aromatic Delights",
    shop: "Scented Candles Co.",
    avatar_link:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU",
    background_link:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg",
  },
  {
    id: 5,
    name: "Tech Haven",
    shop: "Gadgets Galore",
    avatar_link:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU",
    background_link:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg",
  },
  {
    id: 6,
    name: "Baker's Delight",
    shop: "Sweet Treats Bakery",
    avatar_link:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU",
    background_link:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg",
  },
  {
    id: 7,
    name: "Outdoor Escapes",
    shop: "Wilderness Outfitters",
    avatar_link:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU",
    background_link:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg",
  },
  {
    id: 8,
    name: "Fashion Haven",
    shop: "Trendy Threads Boutique",
    avatar_link:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU",
    background_link:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg",
  },
  {
    id: 9,
    name: "Gourmet Cuisine",
    shop: "Epicurean Eats",
    avatar_link:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU",
    background_link:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg",
  },
  {
    id: 10,
    name: "Pet Paradise",
    shop: "Furry Friends Pet Store",
    avatar_link:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU",
    background_link:
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl",
  },
];
