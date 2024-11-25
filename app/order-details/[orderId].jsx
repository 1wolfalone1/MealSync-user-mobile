import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import MapboxGL from "@rnmapbox/maps";
import axios from "axios";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import {
  ConciergeBell,
  MapPinned,
  PackageCheck,
  TicketCheck,
  Timer,
  Truck,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Button,
  Divider,
  HelperText,
  IconButton,
  Modal,
  Portal,
  Surface,
  TextInput,
} from "react-native-paper";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import StepIndicator from "react-native-step-indicator";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import { Colors, Images } from "../../constant";
import colors from "../../constant/colors";
import images from "../../constant/images";
import globalSlice, { globalSelector } from "../../redux/slice/globalSlice";
import {
  convertIntTimeToString,
  formatDateTime,
  formatNumberVND,
  isBeforeOneHour,
  isTodayInVietnam,
} from "../../utils/MyUtils";
if (MapboxGL) {
  MapboxGL?.setAccessToken(
    "sk.eyJ1IjoiMXdvbGZhbG9uZTEiLCJhIjoiY20zdjRjY2M4MHA0bDJqczkwY252NnhvdyJ9.nrhMmt33T1W-Weqz2zXZpg"
  );
}
const lineStyle = {
  lineColor: "#ff0000",
  lineWidth: 3,
  lineCap: "round",
  lineJoin: "round",
};
const OrderTracking = () => {
  console.log(MapboxGL, "asdfasdf map box");
  const { width, height } = Dimensions.get("window");
  const widthItem = (width * 90) / 100;
  const heightItem = (height * 20) / 100;
  const [loadMap, setLoadMap] = useState(
    "https://tiles.goong.io/assets/goong_map_web.json?api_key=PElNdAGV5G98AeTOVaRfIZVeBO6XdVPhJSn2HDku"
  );
  const mapRef = useRef(null);
  const [coordinates] = useState([106.83196028706885, 10.821764739534105]);
  const widthImageIllustration = (width * 30) / 100;
  const camera = useRef(null);
  const [openInfoOrder, setOpenInfoOrder] = useState(false);
  console.log(openInfoOrder, " open");
  const params = useLocalSearchParams();
  const [heightMap, setHeightMap] = useState(0);
  const layoutRef = useRef();
  const translateY = useSharedValue(0);
  const bottomSheetRef = useRef(null);
  const isFocus = useIsFocused();
  const { orderStatusChange } = useSelector(globalSelector);
  const [visible, setVisible] = useState(false);
  const [reasonCancel, setReasonCancel] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [canCancel, setCanCancel] = useState(true);
  const dispatch = useDispatch();
  const [route, setRoute] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeProfile, setRouteProfile] = useState("car"); // 'car', 'bike', 'taxi', 'truck', 'hd'
  const [orderData, setOrderData] = useState(null);
  // callbacks
  useEffect(() => {
    fitBoundsWithPadding();
  }, [locations, fitBoundsWithPadding]);
  useEffect(() => {
    handleGetOrderData();
  }, [isFocus, orderStatusChange]);
  const getDirections = async (start, end) => {
    try {
      const response = await axios.get(`https://rsapi.goong.io/Direction`, {
        params: {
          
          origin: `${start[1]},${start[0]}`,
          destination: `${end[1]},${end[0]}`,
          vehicle: routeProfile,
          api_key: "rk92yVlnm1LVaN5ts1YRSjeii7a31TvGmaqfglh0",

        },
      });

      if (response.data?.routes?.[0]) {
        const route = response.data.routes[0];
        const leg = route.legs[0];

        // Store route information
        setRouteInfo({
          distance: leg.distance,
          duration: leg.duration,
        });

        // Create route GeoJSON
        const geoJson = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                distance: leg.distance.text,
                duration: leg.duration.text,
              },
              geometry: {
                type: "LineString",
                // If steps array is empty, use start and end points
                coordinates:
                  leg.steps.length > 0
                    ? leg.steps.map((step) => [
                        step.start_location.lng,
                        step.start_location.lat,

                      ])
                    : [start, end],
              },
            },
          ],
        };

        setRouteCoordinates(geoJson);

        // Adjust zoom level based on distance
        const distance = leg.distance.value;
        if (distance < 2000) {
          setZoomlevel(15);
        } else if (distance < 5000) {
          setZoomlevel(14);
        } else if (distance < 10000) {
          setZoomlevel(12);
        } else if (distance < 15000) {
          setZoomlevel(11);
        } else {
          setZoomlevel(9);
        }
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  useEffect(() => {
    if (locations.length >= 2) {
      getDirections(locations[0].coord, locations[1].coord);
    }
  }, [locations, routeProfile]);
  const fitBoundsWithPadding = useCallback(() => {
    if (mapRef.current && locations.length >= 2) {
      // Convert locations to bounds
      const coords = locations.map((loc) => loc.coord);
      const bounds = coords.reduce(
        (bounds, coord) => {
          return [
            [
              Math.min(bounds[0][0], coord[0]),
              Math.min(bounds[0][1], coord[1]),
            ],
            [
              Math.max(bounds[1][0], coord[0]),
              Math.max(bounds[1][1], coord[1]),
            ],
          ];
        },
        [coords[0], coords[0]]
      );

      // Fit bounds with padding
      mapRef.current?.fitBounds(bounds, {
        padding: 0,
        animationDuration: 200,
      });
    }
  }, [locations]);
  const handleGetOrderData = async () => {
    try {
      const res = await api.get(`/api/v1/customer/order/${params.orderId}`);
      const data = await res.data;
      console.log(data, " data OrderTracking");
      setOrderData(data.value);
      if (data.value) {
        if (data.value.shopInfo) {
        }
      }
    } catch (err) {
      console.log(err, " error in OrderTracking");
    }
  };
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);
  const genPromotionTitle = (item) => {
    if (item.applyType == 1) {
      return `Giảm ${item.amountRate}%, tối đa ${formatNumberVND(item.maximumApplyValue)}. Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
    } else {
      return `Giảm ${formatNumberVND(item.amountValue)}.  Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
    }
  };
  console.log(heightMap, " height map");
  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);
  useEffect(() => {
    if (orderData) {
      const orderDate = orderData.orderDate;
      if (orderData.isOrderNextDay) {
        if (isTodayInVietnam(orderDate)) {
          if (isBeforeOneHour(orderData.startTime)) {
            setCanCancel(true);
          } else {
            setCanCancel(false);
          }
        } else {
          setCanCancel(true);
        }
      } else {
        if (isBeforeOneHour(orderData.startTime)) {
          setCanCancel(true);
        } else {
          setCanCancel(false);
        }
      }
    }
  }, [orderData]);
  useEffect(() => {
    if (openInfoOrder) {
      translateY.value = withTiming(100);
    } else {
      translateY.value = withTiming(heightMap - 50);
    }
  }, [openInfoOrder]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      minHeight: translateY.value,
    };
  });
  const handleOpenDialogCancelOrder = () => {
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };
  const handleGetPaymentMethodString = (payment) => {
    if (payment) {
      if (payment.paymentMethods == 1) {
        return "Thanh toán online qua VNPay";
      } else {
        return "Thanh toán khi nhận hàng";
      }
    } else {
      return "-";
    }
  };
  const handleCancelOrder = async () => {
    try {
      if (reasonCancel == "") {
        setReasonError("Vui lòng nhập lý do hủy đơn hàng");
        return;
      }
      const res = await api.put(
        `/api/v1/customer/order/${orderData.id}/cancel`,
        {
          reason: reasonCancel,
        }
      );
      const data = await res.data;

      if (data.isSuccess) {
        hideModal();
        dispatch(
          globalSlice.actions.customSnackBar({
            style: {
              color: "white",
              backgroundColor: colors.glass.green,
              pos: {
                top: 40,
              },
              actionColor: "green",
            },
          })
        );
        dispatch(
          globalSlice.actions.openSnackBar({
            message: "Hủy đơn hàng thành công",
          })
        );
        router.push("/order/order-history");
      } else {
        dispatch(
          globalSlice.actions.customSnackBar({
            style: {
              color: "white",
              backgroundColor: Colors.glass.green,
              pos: {
                top: 40,
              },
              actionColor: "yellow",
            },
          })
        );
        dispatch(
          globalSlice.actions.openSnackBar({ message: data?.error?.message })
        );
      }
    } catch (e) {
      dispatch(
        globalSlice.actions.customSnackBar({
          style: {
            color: "white",
            backgroundColor: Colors.glass.green,
            pos: {
              top: 40,
            },
            actionColor: "red",
          },
        })
      );
      dispatch(
        globalSlice.actions.openSnackBar({
          message: "Đã có lỗi xảy ra ở phía máy chủ",
        })
      );
      console.log(e);
    }
  };
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [locations, setLocations] = useState([
    {
      key: "1",
      coord: [106.83196028706885, 10.821764739534105],
    },
    {
      key: "2",
      coord: [ 106.817837319592, 10.80607174450758],
    },
  ]);
  const handleOnPress = (event) => {
    const loc = event.geometry.coordinates;

    camera.current?.moveTo(loc, 200);
  };
  return orderData == null ? (
    <></>
  ) : (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      className="flex-1"
      ref={layoutRef}
      onLayout={(event) => {
        setHeightMap(event.nativeEvent.layout.height); // Store parent height on layout
      }}
    >
      <SafeAreaView
        className="bg-white pb-4 rounded-b-3xl"
        style={styles.shadow}
        edges={["top"]}
      >
        <View className="flex-row justify-center items-center w-full ">
          <IconButton
            className="absolute left-0 "
            icon="chevron-left"
            size={32}
            iconColor={Colors.primaryBackgroundColor}
            onPress={() => router.push("/order/")}
          />
          <Text className="font-hnow64regular text-lg text-primary">
            Cart page
          </Text>
        </View>
      </SafeAreaView>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            borderRadius: 20,
            backgroundColor: "white",
            padding: 20,
            marginHorizontal: 20,
          }}
        >
          <Text className="font-bold text-lg mb-2">
            Lý do hủy đơn hàng #{orderData.id}
          </Text>
          <TextInput
            onChangeText={(value) => setReasonCancel(value)}
            value={reasonCancel}
            mode="outlined"
            label="Lý do ..."
            multiline
            numberOfLines={4}
          />
          <HelperText type="error" visible={reasonError != ""}>
            {reasonError}
          </HelperText>
          <View className="flex-row justify-end gap-2">
            <Button
              mode="contained"
              contentStyle={{
                backgroundColor: "#000000",
              }}
              onPress={hideModal}
            >
              Hủy
            </Button>
            <Button mode="contained" onPress={handleCancelOrder}>
              Xác nhận
            </Button>
          </View>
        </Modal>
      </Portal>
      <View className=" flex-1 items-center bg-red-300">
        <MapboxGL.MapView
          ref={mapRef}
          styleURL={loadMap}
          onPress={handleOnPress}
          style={{
            width: "100%",
            height: "100%",
          }}
          projection="mercator"
          zoomEnabled={true}
        >
          <MapboxGL.Camera

            ref={camera}
            zoomLevel={15}
            
            centerCoordinate={coordinates}
          />
          {routeCoordinates && (
            <MapboxGL.ShapeSource id="routeSource" shape={routeCoordinates}>
              <MapboxGL.LineLayer
                id="routeLine"
                style={{
                  lineColor: "#4285F4",
                  lineWidth: 4,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            </MapboxGL.ShapeSource>
          )}
          {/* 1 point  */}
          {/* <MapboxGL.PointAnnotation 
        id='pointDirect'
        key='pointDirect'
        coordinate={coordinates}
        draggable={true}
         /> */}
          {/* many point */}
          {locations.map((item) => (
            <MapboxGL.PointAnnotation
              id="pointDirect"
              key="0909"
              coordinate={item.coord}
              draggable={true}
            >
              <MapboxGL.Callout title={item.key} />
            </MapboxGL.PointAnnotation>
          ))}
        </MapboxGL.MapView>

        {
          // <Animated.View
          //   style={[
          //     {
          //       width: width,
          //       backgroundColor: 'white',
          //       ...styles.shadow,
          //       borderTopLeftRadius: 16,
          //       borderTopRightRadius: 16,
          //     },
          //     animatedStyle,
          //   ]}
          // >
          //   <TouchableRipple onPress={() => setOpenInfoOrder(state => !openInfoOrder)}>
          //     <View
          //       className="justify-center items-center"
          //       style={{
          //         height: 50,
          //       }}
          //     >
          //       <Equal color={Colors.greyText} size={25} />
          //     </View>
          //   </TouchableRipple>
          //
          //   <Divider className="w-full" />
          //
          //   <View style={{ height: 200 }} />
          // </Animated.View>
        }
      </View>
      <View
        style={{
          width: "100%",
          height: 260,
        }}
      ></View>
      <BottomSheet
        ref={bottomSheetRef}
        style={{
          backgroundColor: "white",
          ...styles.shadow,
          borderRadius: 16,
        }}
        onChange={handleSheetChanges}
        snapPoints={[300, heightMap != 0 ? heightMap : 100]}
      >
        <BottomSheetView
          style={{
            flex: 1,
          }}
        >
          <StepIndicator
            stepCount={4}
            customStyles={customStyles}
            currentPosition={orderData.status - 1}
            labels={labels}
            renderStepIndicator={renderStepIndicator}
          />
          <View className="flex-row px-10 justify-between my-4 items-center">
            <View className="flex-row gap-2 items-center">
              <Text className="text-sm">Tổng cộng: </Text>
              <Text className="text-primary text-lg">
                {formatNumberVND(
                  orderData.totalPrice - orderData.totalPromotion
                )}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="font-hnow63book mr-4 text-green-800">
                Mã đơn hàng: {params.id}
              </Text>
              <Text className="font-hnow63book text-green-800">
                #{orderData.id}
              </Text>
            </View>
          </View>
          <View className="px-10 flex-row justify-between items-center">
            <Text className="font-hnow64regular text-blue-500 text-xs">
              Đặt lúc: {formatDateTime(orderData.orderDate)}
            </Text>
            <Text className="font-hnow64regular text-green-800 text-xs">
              Dự kiến giao:{" "}
              {`${convertIntTimeToString(orderData.startTime)} - ${convertIntTimeToString(orderData.endTime)}`}
            </Text>
          </View>
          <View
            className="flex-row"
            style={{
              height: widthImageIllustration,
            }}
          >
            <Image
              source={images.FoodOrder}
              style={{
                height: widthImageIllustration,
                width: widthImageIllustration,
              }}
            />
            <View className="justify-between py-4 flex-1 pr-10 ">
              <View className="flex-row items-center gap-2">
                <Image
                  source={images.PromotionShopLogo}
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 25,
                    overflow: "hidden",
                  }}
                />
                <Text className="font-bold text-base">
                  {orderData.shopInfo.name}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text
                  numberOfLines={1}
                  className="flex-wrap flex-1 text-sm text-gray-600"
                >
                  {orderData.fullName}
                </Text>
                <Divider className="h-full" style={{ width: 2 }} />
                <Text
                  className="flex-wrap flex-1 text-sm text-gray-600 "
                  style={{
                    textAlign: "right",
                  }}
                >
                  {orderData.phoneNumber}
                </Text>
              </View>
              <View className=" flex-row  items-center gap-2">
                <MapPinned color={"grey"} size={20} />
                <Text
                  numberOfLines={2}
                  className="flex-wrap flex-1 text-xs text-gray-600"
                >
                  {orderData.buildingName}
                </Text>
              </View>
            </View>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            <View>
              <Divider />
              <View className="flex-row justify-between mx-7 items-center">
                <Text className="font-bold">Liên hệ cửa hàng</Text>
                <View className="flex-row">
                  <IconButton
                    style={{
                      margin: 0,
                    }}
                    iconColor="blue"
                    icon={"chat-processing-outline"}
                    onPress={() => {
                      router.push("/chat/" + orderData.id);
                    }}
                  />
                  <IconButton
                    onPress={() => {}}
                    style={{
                      margin: 0,
                    }}
                    iconColor="red"
                    icon="phone"
                  />
                </View>
              </View>
              <Divider />
            </View>
            {orderData.voucher && orderData.voucher.promotionId && (
              <View className="flex-row gap-1 flex-1">
                <TicketCheck size={20} color={Colors.primaryBackgroundColor} />
                <Text>{orderData.voucher.title}</Text>
              </View>
            )}
            <Text className="pl-7 text-lg font-bold">Thông tin giỏ hàng</Text>
            {orderData.orderDetails.map((product) => (
              <View className="flex-row gap-4 pl-7 mt-4">
                <Image
                  source={{ uri: product.imageUrl }}
                  style={{
                    height: parseInt((width * 25) / 100),
                    width: parseInt((width * 25) / 100),
                    borderRadius: 10,
                  }}
                />
                <View className="flex-1 justify-between">
                  <Text numberOfLines={2} className="font-bold text-lg">
                    {product.name}
                  </Text>
                  <View className="flex-1">
                    <Text>
                      {product.optionGroups &&
                        Array.isArray(product.optionGroups) &&
                        product.optionGroups.length > 0 &&
                        product.optionGroups
                          .map((option) => {
                            if (
                              option.options &&
                              Array.isArray(option.options)
                            ) {
                              const des = option.options.reduce((a, c, i) => {
                                if (i === 0) {
                                  return c.optionTitle;
                                } else {
                                  return a + ", " + c.optionTitle;
                                }
                              }, "");

                              return option.optionGroupTitle + ": " + des;
                            } else {
                              return "";
                            }
                          })
                          .join(" & ")}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-primary text-base">
                      {formatNumberVND(product.totalPrice)}
                    </Text>
                    <Text className="text-gray-600 text-base  font-bold">
                      / {product.quantity} món
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            {orderData.promotion && (
              <>
                <Text className="pl-7 text-lg font-bold mt-8">Giảm giá</Text>
                <Surface
                  className="flex-row my-4 mx-7 flex-1"
                  style={{
                    height: 50,
                    borderRadius: 16,
                    backgroundColor: "white",
                  }}
                  elevation={1}
                >
                  <Image
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 16,
                    }}
                    source={Images.PromotionShopLogo}
                  />
                  <View className="flex-row ml-2 flex-1 items-center">
                    <Text
                      className="font-hnow64regular flex-wrap flex-1 text-gray-600"
                      numberOfLines={2}
                    >
                      {genPromotionTitle(orderData.promotion)}
                    </Text>
                  </View>
                </Surface>
              </>
            )}
            <Text className="pl-7 text-lg font-bold mt-4">
              Phương thức thanh toán
            </Text>
            <Text numberOfLines={4} className="pl-7 text-sm text-gray-600 mb-8">
              {handleGetPaymentMethodString(orderData.payments)}
            </Text>

            <Text className="pl-7 text-lg font-bold mt-1">Ghi chú</Text>
            <Text numberOfLines={4} className="pl-7 text-sm text-gray-600 mb-8">
              {orderData.note}
            </Text>
            <View className="px-7">
              <Button
                mode="elevated"
                textColor="white"
                buttonColor={Colors.cyan500}
                theme={{ roundness: 2 }}
                contentStyle={{
                  paddingVertical: 4,
                }}
                className="rounded-xl"
                labelStyle={{
                  fontFamily: "HeadingNow-64Regular",
                  fontSize: 20,
                  lineHeight: 22,
                }}
                disabled={!canCancel}
                onPress={handleOpenDialogCancelOrder}
              >
                Hủy đơn hàng
              </Button>
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default OrderTracking;
const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: 300,
    width: 300,
  },
  map: {
    height: 300,
    width: 300,
  },
  container: {
    flex: 1,
  },

  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: "black",

    shadowOpacity: 0.9,
    elevation: 20,
  },
});
const labels = ["Chờ xác nhận", "Shop đang làm", "Đang giao", "Hoàn thành"];
const customStyles = {
  stepIndicatorSize: 35,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: Colors.blue[100],
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: Colors.blue[100],
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: Colors.blue[100],
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: Colors.blue[100],
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 30,
  currentStepIndicatorLabelFontSize: 35,
  stepIndicatorLabelCurrentColor: Colors.blue[100],
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 12,
  currentStepLabelColor: Colors.blue[100],
};
const getStepIndicatorIconConfig = ({ position, stepStatus }) => {
  const iconConfig = {
    color: stepStatus === "finished" ? "#ffffff" : Colors.blue[100],
    size: 24,
  };

  return iconConfig;
};

const renderStepIndicator = (params) => {
  const { position, stepStatus } = params;
  if (position == 0) {
    return <Timer {...getStepIndicatorIconConfig(params)} />;
  } else if (position == 1) {
    return <ConciergeBell {...getStepIndicatorIconConfig(params)} />;
  } else if (position == 2) {
    return <Truck {...getStepIndicatorIconConfig(params)} />;
  } else if (position == 3) {
    return <PackageCheck {...getStepIndicatorIconConfig(params)} />;
  }
};
