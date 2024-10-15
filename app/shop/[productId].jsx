import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import SkeletonLoading from "expo-skeleton-loading";
import { ChevronRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Chip,
  Divider,
  Modal,
  Portal,
  TouchableRipple,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import FloatCartButton from "../../components/shop/FloatCartButton";
import ToppingItem from "../../components/shop/ToppingItem";
import { Colors } from "../../constant";
import colors from "../../constant/colors";
import cartSlice from "../../redux/slice/cartSlice";
import globalSlice from "../../redux/slice/globalSlice";
import shopDetailsSlice, {
  dataShopDetailsSelector,
  getProductDetailsById,
} from "../../redux/slice/shopDetailsSlice";
import { convertIntTimeToString, formatNumberVND } from "../../utils/MyUtils";

const ProductDetail = () => {
  const { productId } = useLocalSearchParams();
  const { product } = useSelector(dataShopDetailsSelector);
  const { info, topping, toppingSelected } = useSelector(
    dataShopDetailsSelector
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!info) {
      router.push("/home");
      return () => {
        dispatch(shopDetailsSlice.actions.resetProductDetails());
      };
    }
    dispatch(
      getProductDetailsById({
        shopId: info.id,
        id: productId,
      })
    );

    dispatch(globalSlice.actions.changeStateOpenFabInShop(false));
    return () => {
      dispatch(shopDetailsSlice.actions.resetProductDetails());

      dispatch(globalSlice.actions.changeStateOpenFabInShop(true));
    };
  }, []);

  useEffect(() => {
    console.log(topping, "topping ne");
    if (Array.isArray(topping)) {
      let isValid = true;
      topping.forEach((item) => {
        if (item.isRequire) {
          if (toppingSelected.radio[item.id]) {
            isValid = false;
          }
        }
      });
      setCanAddTooCart(isValid);
    }
  }, [toppingSelected, topping]);
  const [isLiked, setIsLiked] = useState(false);
  const [toppingChecked, setToppingChecked] = useState(null);
  const [sauceChecked, setSauceChecked] = useState(null);
  const [canAddTooCart, setCanAddTooCart] = useState(true);
  const [openOperatingSlotsSelect, setOpenOperatingSlotsSelect] =
    useState(false);
  const handleAddLike = () => {
    setIsLiked(!isLiked);
  };
  console.log(product, " product detials in selector");
  const [totalOrder, setTotalOrder] = useState(product.total_order || 0);

  const handleDecrease = () => {
    if (totalOrder > 0) {
      setTotalOrder((prevTotalOrder) => Math.max(prevTotalOrder - 1, 0));
    }
  };
  console.log(product, " product detials in page");
  const handleAddToCart = (slotId) => {
    if (totalOrder != 0) {
      dispatch(
        cartSlice.actions.addToCart({
          productId: product.id,
          shopId: info.id,
          quantity: totalOrder,
          topping: toppingSelected,
          price: product.price,
          operatingSlotId: slotId,
        })
      );
      handleDismissOperatingSlotsSelect();
      dispatch(
        globalSlice.actions.customSnackBar({
          style: {
            color: "white",
            icon: "camera",
            backgroundColor: Colors.glass.green,
            pos: {
              top: 40,
            },
            actionColor: "yellow",
          },
        })
      );

      dispatch(
        globalSlice.actions.openSnackBar({
          message: "Add to Cart successfully",
        })
      );
      router.back();
    } else {
      dispatch(
        globalSlice.actions.customSnackBar({
          style: {
            color: "white",
            backgroundColor: Colors.glass.red,
            pos: {
              top: 40,
            },
            actionColor: "yellow",
          },
        })
      );
      dispatch(
        globalSlice.actions.openSnackBar({ message: "Đơn hàng phải lớn hơn 0" })
      );
    }
  };
  const handleIncrease = () => {
    setTotalOrder((prevTotalOrder) => prevTotalOrder + 1);
  };
  const handleDismissOperatingSlotsSelect = () => {
    setOpenOperatingSlotsSelect(false);
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Portal>
        <Modal
          visible={openOperatingSlotsSelect}
          onDismiss={handleDismissOperatingSlotsSelect}
          contentContainerStyle={{
            borderRadius: 20,
            backgroundColor: "white",
            padding: 20,
            marginHorizontal: 20,
          }}
        >
          <Text className="font-bold text-xl mb-4">
            Chọn khung thời gian giao hàng
          </Text>
          {product.operatingSlots.map((item) => (
            <View key={item.id}>
              <TouchableRipple
                className="py-4"
                onPress={() => handleAddToCart(item.id)}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-gray-800">
                    {item.title} từ {convertIntTimeToString(item.startTime)} đến{" "}
                    {convertIntTimeToString(item.endTime)}
                  </Text>
                  <ChevronRight size={18} color={"grey"} />
                </View>
              </TouchableRipple>

              <Divider />
            </View>
          ))}
          <View className="flex-row justify-end gap-2 mt-2">
            <Button
              mode="contained"
              contentStyle={{
                backgroundColor: "#000000",
              }}
              onPress={handleDismissOperatingSlotsSelect}
            >
              Hủy
            </Button>
          </View>
        </Modal>
      </Portal>
      <FloatCartButton />
      {product.id == 0 ? (
        <SkeletonItem />
      ) : (
        <View className="flex-1 bg-white">
          <ScrollView className="">
            <View className="flex-1 mx-8 mb-12">
              <Image
                className="h-48 rounded-lg"
                resizeMode="cover"
                source={{ uri: product.imageUrl }}
              />
              <View className="flex-row justify-between items-center flex-shrink: 0">
                <Text className="text-3xl font-bold mt-4">{product.name}</Text>
                <TouchableRipple
                  key={product.id}
                  onPress={() => handleAddLike()}
                  rippleColor={colors.primaryTextColor}
                >
                  <View>
                    {isLiked ? (
                      <AntDesign name="heart" size={24} color="red" />
                    ) : (
                      <AntDesign name="hearto" size={24} color="black" />
                    )}
                  </View>
                </TouchableRipple>
              </View>
              <View className="flex-row items-center my-1">
                <AntDesign name="star" size={24} style={{ color: "#FFC529" }} />
                <Text className="font-bold ml-1">4.5</Text>
                <Button
                  labelStyle={{
                    color: Colors.btnText,
                    textDecorationLine: "underline",
                  }}
                  onPress={() => router.push("/review")}
                >
                  Đánh giá
                </Button>
              </View>

              <View className="flex-row justify-between">
                <Text
                  style={{ color: colors.primaryBackgroundColor }}
                  className="font-hnow64regular text-xl"
                >
                  {formatNumberVND(product.price)}
                </Text>
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={handleDecrease}>
                    <AntDesign
                      name="minuscircleo"
                      size={24}
                      color={colors.primaryBackgroundColor}
                    />
                  </TouchableOpacity>
                  <Text className="font-bold mx-2 text-lg">{totalOrder}</Text>
                  <TouchableOpacity onPress={handleIncrease}>
                    <AntDesign
                      name="pluscircle"
                      size={24}
                      color={colors.primaryBackgroundColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <FlatList
                  horizontal
                  data={product?.operatingSlots}
                  ItemSeparatorComponent={() => <View className="w-[16]" />}
                  renderItem={({ item }) => (
                    <Chip
                    
                    background={'red'}
                    mode=""
                    >
                      {convertIntTimeToString(item.startTime)} - 
                      {convertIntTimeToString(item.endTime)}
                    </Chip>
                  )}
                />
              </View>
              <Text className="text-gray-500 my-4">{product.description}</Text>

              <View className="flex-1">
                {product.foodOptionGroups.map((item, index) => (
                  <ToppingItem topping={item} key={item.id} />
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      )}
      <View className="flex mb-4 w-full items-center absolute bottom-0">
        <Button
          textColor="white"
          mode="elevated"
          disabled={canAddTooCart}
          buttonColor={Colors.primaryBackgroundColor}
          className="rounded-full items-center"
          labelStyle={{
            padding: 2,
          }}
          icon="shopping"
          onPress={() => setOpenOperatingSlotsSelect(true)}
        >
          Thêm vào giỏ hàng
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetail;
const SkeletonItem = () => {
  return (
    <SkeletonLoading
      background={Colors.skeleton.bg}
      highlight={Colors.skeleton.hl}
    >
      <View
        style={{
          marginHorizontal: 32,
          marginBottom: 44,
        }}
      >
        <View
          style={{
            height: 192,
            borderRadius: 8,
            backgroundColor: Colors.skeleton.bg,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 36,
              marginTop: 16,
              width: 200,
              backgroundColor: Colors.skeleton.bg,
              borderRadius: 8,
            }}
          />
          <View>
            <AntDesign name="heart" size={24} color="red" />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 4,
          }}
        >
          <AntDesign name="star" size={24} style={{ color: "#FFC529" }} />
          <Text className="font-bold ml-1">4.5 +</Text>

          <Button
            labelStyle={{
              color: Colors.btnText,
              textDecorationLine: "underline",
            }}
            onPress={() => router.push("/review")}
          >
            Đánh giá
          </Button>
        </View>

        <View className="flex-row justify-between">
          <View
            style={{
              height: 28,
              width: 100,
              borderRadius: 10,
              backgroundColor: Colors.skeleton.bg,
            }}
          />
          <View className="flex-row items-center">
            <TouchableOpacity>
              <AntDesign
                name="minuscircleo"
                size={24}
                color={colors.primaryBackgroundColor}
              />
            </TouchableOpacity>
            <View
              style={{
                height: 28,
                width: 40,
                borderRadius: 30,
                backgroundColor: Colors.skeleton.bg,
              }}
            />
            <TouchableOpacity>
              <Ionicons
                name="add-circle"
                size={32}
                color={colors.primaryBackgroundColor}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            height: 14,
            flexGrow: 1,
            backgroundColor: Colors.skeleton.bg,
            borderRadius: 8,
            marginBottom: 10,
            marginTop: 10,
          }}
        />
        <View
          style={{
            height: 14,
            flexGrow: 1,
            marginBottom: 10,
            backgroundColor: Colors.skeleton.bg,
            borderRadius: 8,
          }}
        />
        <View
          style={{
            height: 14,
            flexGrow: 1,
            backgroundColor: Colors.skeleton.bg,
            borderRadius: 8,
            marginBottom: 10,
          }}
        />
      </View>
    </SkeletonLoading>
  );
};
