import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import FloatCartButton from "../../components/shop/FloatCartButton";
import HeaderShopAnimated from "../../components/shop/HeaderShopAnimated";
import HeaderStickyShop from "../../components/shop/HeaderStickyShop";
import ItemAllProductInShop from "../../components/shop/ItemAllProductInShop";
import ListBestProductInShop from "../../components/shop/ListBestProductInShop";
import ListPromotionInShop from "../../components/shop/ListPromotionInShop";
import { Colors } from "../../constant";
import images from "../../constant/images";
import usePagination from "../../custom-hook/usePagination";
import usePullToRefresh from "../../custom-hook/usePullToRefresh";
import globalSlice from "../../redux/slice/globalSlice";
import shopDetailsSlice, {
  addMoreProductInShopDetails,
  dataShopDetailsSelector,
  getListAllProductsInShop,
  getListBestProduct,
  getListPromotionInShop,
  getShopInfo,
  listAllProductSelector,
  listBestProductSelector,
  listPromotionShopSelector,
  shopInfoSelector,
} from "../../redux/slice/shopDetailsSlice";

const listEmpty = new Array(9).fill(null);
const ShopPage = () => {
  const { width, height } = Dimensions.get("window");
  const widthIllu = (width * 80) / 100;
  const { searchState } = useSelector(dataShopDetailsSelector);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  let scrollOffsetY = useRef(new Animated.Value(0)).current;
  const [isHeaderTop, setIsHeaderTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [isNotScroll, setIsNotScroll] = useState(true);
  const heightHeaderSticky = 80;
  const params = useLocalSearchParams();
  const shopInfo = useSelector(shopInfoSelector);
  const listPromotion = useSelector(listPromotionShopSelector);
  const listBestProduct = useSelector(listBestProductSelector);
  const listAllProduct = useSelector(listAllProductSelector);
  const [scrollEventThrottle, setScrollEventThrottle] = useState(1000);
  const dispatch = useDispatch();
  const { totalPage } = useSelector(dataShopDetailsSelector);
  const [isLoading, setLoading] = useState(true);
  const isFocus = useIsFocused();

  const { refreshing, onRefreshHandler } = usePullToRefresh({
    onRefreshFunction() {
      setCurrentPage(1);
      dispatch(getListAllProductsInShop(shopId));
    },
  });
  useEffect(() => {
    if (shopInfo) {
      console.log(
        productId != null,
        " ???SDFasdljkfjasdlkfkaljsdfl;kasdjf",
        productId
      );
      if (productId) {
        console.log(productId, " isssssssssssssssssssssssssss");
        let productId2 = productId;
        router.setParams({ productId: "" });
        router.push("/shop/" + productId2);
      } else if (review == "true") {
        router.setParams({review: "" });
        router.push("/shop/review");
      }
    }
  }, [shopInfo]);
  const { currentPage, handleEndReached, setCurrentPage } = usePagination({
    fetchFunction: () => {
      dispatch(addMoreProductInShopDetails(currentPage + 1));
    },
    setLoading: setLoading,
    totalPages: totalPage,
    initialPage: 1,
  });
  useEffect(() => {}, [height]);
  const { shopId, productId, review } = params;
  const product = {
    id: "banhmi01",
    name: "Bánh mì",
    description:
      "Bánh mì với lớp vỏ ngoài giòn tan, ruột mềm, còn bên trong là phần nhân",
    price: "20000",
    image_url:
      "https://cdn.24h.com.vn/upload/1-2024/images/2024-03-16//1710602210-1710445729-picture-1-1710445636-793-width1200height900-width1200height900.jpg",
    total_order: 2,
    status: "active",
    shop_id: "shop01",
  };
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {}
    );
    return () => subscription?.remove();
  }, []);
  useEffect(() => {
    dispatch(getListBestProduct(shopId));
  }, [searchState]);
  useEffect(() => {
    dispatch(getListPromotionInShop(shopId));
    dispatch(getShopInfo(shopId));

    dispatch(getListAllProductsInShop(shopId));
    const listener = scrollOffsetY.addListener(({ value }) => {
      if (value <= height + 100) {
        setScrollEventThrottle(10000);
      } else {
        setScrollEventThrottle(16);
      }
      if (value <= 0) {
        setIsNotScroll(true);
      } else {
        setIsNotScroll(false);
      }
      if (value > 252 + 150) {
        setIsHeaderTop(true);
        setIsSearchOpen(true); //
      } else {
        setIsHeaderTop(false);
        setIsSearchOpen(false);
      }
    });

    dispatch(globalSlice.actions.changeStateOpenFabInShop(true));
    return () => {
      dispatch(shopDetailsSlice.actions.resetState());
      scrollOffsetY.removeListener(listener);
    };
  }, []);

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [listCategory, setListCategory] = useState([]);
  const getListCate = async () => {
    try {
      const res = await api.get("/api/v1/shop/" + shopId + "/category");
      const data = await res.data;
      if (data.isSuccess) {
        setListCategory(
          data.value.reduce(
            (acc, i) => {
              return [
                ...acc,
                {
                  label: i.name,
                  value: i.id,
                },
              ];
            },
            [
              {
                label: "Tất cả",
                value: null,
              },
            ]
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getListCate();
  }, []);
  useEffect(() => {
    dispatch(
      shopDetailsSlice.actions.changeSearchInfo({
        categoryId: selectedCategory,
      })
    );
  }, [selectedCategory]);
  return (
    <SafeAreaView
      className="flex-1"
      style={{ zIndex: -1, backgroundColor: "#ffffffff" }}
    >
      <FloatCartButton />

      <HeaderStickyShop
        shopInfo={shopInfo}
        isHeaderTop={isHeaderTop}
        heightHeaderSticky={heightHeaderSticky}
        shopName={"Tiem Banh Mi Dem asdfkja asdfkljasf asasdfasfds sdafadf  fd"}
      />
      <HeaderShopAnimated
        shopInfo={shopInfo}
        isNotScroll={isNotScroll}
        heightHeaderSticky={heightHeaderSticky}
        shopName={"Tiem Banh Mi Dem asdfkja asdfkljasf asasdfasfds sdafadf  fd"}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        isHeaderTop={isHeaderTop}
        setIsHeaderTop={setIsHeaderTop}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        image_url={product.image_url}
        animHeaderValue={scrollOffsetY}
      />

      <FlatList
        style={{ zIndex: -1, height: "100%" }}
        scrollEventThrottle={1}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          {
            useNativeDriver: false,
          }
        )}
        ListHeaderComponentStyle={{}}
        data={[]}
        contentContainerStyle={{
          justifyContent: "center",
          backfaceVisibility: "black",
        }}
        ListHeaderComponent={() => {
          return (
            <View className="mt-4" key={1}>
              <View className="flex-row  items-center px-8  mt-5">
                <DropDownPicker
                  listMode="SCROLLVIEW"
                  open={open}
                  style={{
                    borderColor: Colors.primaryBackgroundColor,
                    width: "80%",
                  }}
                  zIndex={3000}
                  zIndexInverse={1000}
                  categorySelectable={true}
                  placeholderStyle={{ color: "grey" }}
                  dropDownContainerStyle={{
                    backgroundColor: "white",

                    borderColor: Colors.primaryBackgroundColor,
                    width: "80%",
                  }}
                  textStyle={{}}
                  value={selectedCategory}
                  items={listCategory}
                  setOpen={setOpen}
                  onChangeValue={(value) => {}}
                  setValue={setSelectedCategory}
                  setItems={setListCategory}
                  placeholder={"Lọc theo thể loại"}
                />
              </View>

              <View className="flex-row  items-center px-8  mt-5">
                <Image
                  className="rounded-md"
                  style={{
                    height: 28,
                    width: 28,
                  }}
                  source={images.FlashSale}
                />
                <Text className="text-lg font-hnow65medium px-2">
                  Giảm giá cho bạn
                </Text>
              </View>
              <ListPromotionInShop listPromotion={listPromotion} />
              {listBestProduct ? (
                listBestProduct &&
                Array.isArray(listBestProduct) &&
                listBestProduct.length > 0 ? (
                  listBestProduct.map((item, index) => (
                    <View key={item.id}>
                      <Text className="text-lg font-hnow65medium px-8 mt-1">
                        {item.categoryName}
                      </Text>
                      <ListBestProductInShop data={item.foods} />
                    </View>
                  ))
                ) : (
                  <>
                    <View className=" mt-1">
                      <Image
                        source={{
                          uri: "https://mealsync.s3.ap-southeast-1.amazonaws.com/image/1733499673958-cca03ac5-281b-46b3-ae0c-46afe5cff5bb.png",
                        }}
                        style={{
                          height: widthIllu - 100,
                          width: widthIllu,
                        }}
                      />
                    </View>
                  </>
                )
              ) : (
                <>
                  <View>
                    <Text className="text-lg font-hnow65medium px-8 mt-1">
                      Sản phẩm của cửa hàng
                    </Text>
                    <ListBestProductInShop data={[null, null, null]} />
                  </View>
                  <View>
                    <Text className="text-lg font-hnow65medium px-8 mt-1">
                      Sản phẩm tốt nhất
                    </Text>
                    <ListBestProductInShop data={[null, null, null]} />
                  </View>
                </>
              )}
            </View>
          );
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 28,
        }}
        numColumns={2}
        /*   keyExtractor={(item) => {
          return item?.id;
        }} */
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.01}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        renderItem={({ item }) => <ItemAllProductInShop item={item} />}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="large" /> : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshHandler}
          />
        }
      />
    </SafeAreaView>
  );
};

export default ShopPage;
