import { useLocalSearchParams } from "expo-router";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import FloatCartButton from "../../components/shop/FloatCartButton";
import HeaderShopAnimated from "../../components/shop/HeaderShopAnimated";
import HeaderStickyShop from "../../components/shop/HeaderStickyShop";
import ItemAllProductInShop from "../../components/shop/ItemAllProductInShop";
import ListBestProductInShop from "../../components/shop/ListBestProductInShop";
import ListPromotionInShop from "../../components/shop/ListPromotionInShop";
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

const ShopPage = () => {
  const { width, height } = Dimensions.get("window");
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
  const { refreshing, onRefreshHandler } = usePullToRefresh({
    onRefreshFunction() {
      setCurrentPage(1);
      console.log("tgestsdfasdfasdfasdfasdf");
      dispatch(getListAllProductsInShop(shopId));
    },
  });
  const { currentPage, handleEndReached, setCurrentPage } = usePagination({
    fetchFunction: () => {
      dispatch(addMoreProductInShopDetails(currentPage + 1));
    },
    setLoading: setLoading,
    totalPages: totalPage,
    initialPage: 1,
  });
  useEffect(() => {
    console.log("height: " + height);
  }, [height]);
  const { shopId } = params;
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
  console.log(params, " params");
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        console.log(window, "window");
        console.log(screen, "screen");
      }
    );
    return () => subscription?.remove();
  });
  useEffect(() => {
    dispatch(getListPromotionInShop(shopId));
    dispatch(getShopInfo(shopId));
    dispatch(getListBestProduct(shopId));
    console.log();

    dispatch(getListAllProductsInShop(shopId));
    const listener = scrollOffsetY.addListener(({ value }) => {
      // console.log(value, ' scroll value');
      console.info("test", " asdfasd");
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
    console.log(" testtstest");

    dispatch(globalSlice.actions.changeStateOpenFabInShop(true));
    return () => {
      dispatch(globalSlice.actions.changeStateOpenFabInShop(false));
      dispatch(shopDetailsSlice.actions.resetState());
      scrollOffsetY.removeListener(listener);
    };
  }, []);
  const listEmpty = new Array(9).fill(null);

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
        data={listAllProduct ? listAllProduct : listEmpty}
        contentContainerStyle={{
          justifyContent: "center",
          backfaceVisibility: "black",
        }}
        ListHeaderComponent={() => {
          return (
            <View className="mt-4">
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
              <Text className="text-lg font-hnow65medium px-8 mt-1">
                Tất cả sản phẩm
              </Text>
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
