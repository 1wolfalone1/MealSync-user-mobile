import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import MapboxGL from "@rnmapbox/maps";
import axios from "axios";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import {
  CalendarCheck2,
  Coins,
  ConciergeBell,
  MapPinned,
  NotepadText,
  PackageCheck,
  TicketCheck,
  Timer,
  Truck,
  Utensils,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
import { userInfoSliceSelector } from "../../redux/slice/userSlice";
import {
  convertIntTimeToString,
  formatDateTime,
  formatNumberVND,
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
  const width2 = (width * 80) / 100;
  const [qrUrl, setQrUrl] = useState("");
  const [loadMap, setLoadMap] = useState(
    "https://tiles.goong.io/assets/goong_map_web.json?api_key=PElNdAGV5G98AeTOVaRfIZVeBO6XdVPhJSn2HDku"
  );
  const mapRef = useRef(null);
  const [coordinates] = useState([106.83196028706885, 10.821764739534105]);
  const [point1, setPoint1] = useState(null); // Longitude, Latitude
  const [point2, setPoint2] = useState(null);
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
  const { orderStatusChange, isOrderDetails } = useSelector(globalSelector);
  const [visible, setVisible] = useState(false);
  const [reasonCancel, setReasonCancel] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [canCancel, setCanCancel] = useState(false);
  const dispatch = useDispatch();
  const [route, setRoute] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeProfile, setRouteProfile] = useState("car"); // 'car', 'bike', 'taxi', 'truck', 'hd'
  const [orderData, setOrderData] = useState(null);
  const [pos, setPos] = useState(0);
  const info = useSelector(userInfoSliceSelector);
  console.log(point1, point2, " point1 , ponin 2 ne");
  const changePos = () => {
    if (orderData) {
      if (orderData.status == 1 || orderData.status == 3) {
        console.log("111111111111111111111111111111111111111111111");
        setPos(0);
      } else if (orderData.status == 5) {
        setPos(1);
      } else if (orderData.status == 6) {
        setPos(2);
      } else {
        setPos(3);
      }
    }
  };
  console.log(info, orderData, " dta order ne");
  useEffect(() => {
    changePos();
  }, [orderData]);
  // callbacks
  //----------------------------------------------------------------

  const apiKey = "rk92yVlnm1LVaN5ts1YRSjeii7a31TvGmaqfglh0";
  const fetchDirections = async () => {
    try {
      const start = point1;
      const end = point2;
      if (!start || !end) {
        return;
      }
      const response = await axios.get(`https://rsapi.goong.io/Direction`, {
        params: {
          origin: `${start[1]},${start[0]}`,
          destination: `${end[1]},${end[0]}`,
          vehicle: routeProfile,
          api_key: apiKey,
        },
      });
      console.log(response, " response  neeeeeeeeeeeeeeeeeeeeee");
      const polyline = response.data.routes[0]?.overview_polyline?.points;

      if (polyline) {
        const decodedCoordinates = decodePolyline(polyline);
        setRouteCoordinates(decodedCoordinates);
      } else {
        Alert.alert("Error", "No route found");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      Alert.alert("Error", "Failed to fetch directions");
    } finally {
    }
  };
  useEffect(() => {
    fetchDirections();
  }, [point1, point2]);

  const decodePolyline = (encoded) => {
    // Decode a polyline into an array of coordinates
    let points = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push([lng * 1e-5, lat * 1e-5]);
    }
    return points;
  };
  useEffect(() => {
    dispatch(globalSlice.actions.changeIsOrderDetails(true));
    handleGetOrderData();
    return () => {
      dispatch(globalSlice.actions.changeIsOrderDetails(false));
    };
  }, []);
  //------------------------------------------------------------------
  useEffect(() => {
    console.log(orderStatusChange, "dsfafsfas asf asf as");
    if (orderStatusChange) {
      if (orderStatusChange.referenceId == params.orderId && isOrderDetails) {
        handleGetOrderData();
      }
    }
  }, [isFocus, orderStatusChange]);
  const handleGetOrderData = async () => {
    try {
      dispatch(
        globalSlice.actions.changeLoadings({
          isLoading: true,
          msg: "Đang tải dữ liệu...",
        })
      );
      const res = await api.get(`/api/v1/customer/order/${params.orderId}`);
      const data = await res.data;
      console.log(data, " data OrderTracking");
      setOrderData(data.value);
      if (data.value) {
        if (data.value.shopInfo) {
          setPoint1([data.value.longitude, data.value.latitude]);
          setPoint2([
            data.value.shopInfo.longitude,
            data.value.shopInfo.latitude,
          ]);
        }
      }
    } catch (err) {
      console.log(err, " error in OrderTracking");
    } finally {
      dispatch(
        globalSlice.actions.changeLoadings({
          isLoading: false,
          msg: "Đang tải dữ liệu...",
        })
      );
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
    console.log(orderData, " order data");
    if (orderData) {
      const orderDate = orderData.orderDate;
      if (
        orderData.status == 1 ||
        orderData.status == 3 ||
        orderData.status == 5
      ) {
        if (orderData.isCancelAllowed) {
          setCanCancel(true);
        }
        return;
      } else if (orderData.status == 6) {
        setCanCancel(true);
        return;
      } else if (orderData.status == 8) {
        router.replace("/order/order-issue");
        return;
      } else if (orderData.status == 2 || orderData.status == 4) {
        router.replace("/order/order-history");
        return;
      } else {
      }
    }
  }, [orderData]);
  useEffect(() => {
    if (orderData) {
      if (orderData.status == 7) {
        router.replace({
          pathname: "/order-delivery-success",
          params: {
            orderId: orderData.id,
          },
        });
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
  const handleOpenDialogCancelOrder = async () => {
    if (
      orderData.status == 1 ||
      orderData.status == 3 ||
      orderData.status == 5
    ) {
      setVisible(true);
      if (orderData.status == 5) {
        setCanCancel(false);
      }
    } else if (orderData.status == 6) {
      setCanCancel(true);
      try {
        const res = await api.get(
          `api/v1/customer/order/${orderData.id}/qr/received`
        );
        const data = await res.data;
        console.log(data, " data OrderTracking");
        if (data.isSuccess) {
        }
        if (data.value) {
          if (data.value.qrUrl) {
            setQrUrl(data.value.qrUrl);
            setVisible(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    } else if (orderData.status == 7) {
    }
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
        `/api/v1/customer/order/${orderData.id}/cancel?reason=${reasonCancel}`
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
            message: "Hủy đơn hàng thành công 🥳",
          })
        );
        router.replace("/order/order-history");
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
          globalSlice.actions.openSnackBar({
            message: data?.error?.message + "😡",
          })
        );
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.status == 400) {
          dispatch(
            globalSlice.actions.customSnackBar({
              style: {
                color: "white",
                backgroundColor: "red",
                pos: {
                  top: 40,
                },
                actionColor: "white",
              },
            })
          );
          dispatch(
            globalSlice.actions.openSnackBar({
              message: e.response?.data?.error?.message + "😠",
            })
          );
        } else {
          dispatch(
            globalSlice.actions.customSnackBar({
              style: {
                color: "white",
                backgroundColor: Colors.glass.red,
                pos: {
                  top: 40,
                },
                actionColor: "white",
              },
            })
          );
          dispatch(
            globalSlice.actions.openSnackBar({
              message: "Có gì đó sai sai! Mong bạn thử lại sau 🥲",
            })
          );
        }
      }
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
      coord: [106.817837319592, 10.80607174450758],
    },
  ]);
  const handleOnPress = (event) => {
    const loc = event.geometry.coordinates;

    camera.current?.moveTo(loc, 200);
  };
  const getButtonAction = () => {
    if (
      orderData.status == 3 ||
      orderData.status == 1 ||
      orderData.status == 5
    ) {
      return "Hủy đơn hàng";
    } else if (orderData.status == 6) {
      return "Đưa QR code cho shipper xác nhận";
    } else if (orderData.status == 8) {
      return "Xác nhận hoàn thành đơn hàng";
    }
  };
  const [mapLoaded, setMapLoaded] = useState(false);
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
            onPress={() => router.replace("/order/")}
          />
          <Text className="font-hnow64regular text-lg text-primary">
            Đơn hàng đang giao
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
          {orderData.status == 6 ? (
            <>
              <View>
                <View className="justify-center flex-row ">
                  <Text className="font-bold text-lg">
                    Mã QR cho đơn hàng #{orderData.id}
                  </Text>
                </View>
                <Image
                  source={{
                    uri: qrUrl,
                  }}
                  style={{
                    width: width2,
                    height: width2,
                    borderRadius: 10,
                  }}
                />
                <View className="flex-row justify-end gap-2">
                  <Button
                    mode="contained"
                    contentStyle={{
                      backgroundColor: "#000000",
                    }}
                    onPress={() => {
                      hideModal();
                      setQrUrl("");
                    }}
                  >
                    Đóng
                  </Button>
                </View>
              </View>
            </>
          ) : (
            <>
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
            </>
          )}
        </Modal>
      </Portal>
      <View className=" flex-1 items-center bg-red-300">
        {point1 && point2 && (
          <MapboxGL.MapView
            ref={mapRef}
            styleURL={loadMap}
            onDidFinishLoadingMap={() => setMapLoaded(true)}
            onPress={handleOnPress}
            style={{
              width: "100%",
              height: "100%",
            }}
            projection="mercator"
            zoomEnabled={true}
          >
            <MapboxGL.Camera
              bounds={{
                ne: [
                  Math.max(point1[0], point2[0]),
                  Math.max(point1[1], point2[1]),
                ], // Northeast corner
                sw: [
                  Math.min(point1[0], point2[0]),
                  Math.min(point1[1], point2[1]),
                ], // Southwest corner
                paddingTop: 100,
                paddingBottom: 100,
                paddingLeft: 100,
                paddingRight: 100,
              }}
              animationMode="easeTo"
              animationDuration={1000}
            />
            <MapboxGL.Images
              images={{
                customerIcon: require("../../assets/images/pin-map.png"), // Replace with the path to your customer image
                shopIcon: require("../../assets/images/restaurant.png"), // Replace with the path to your shop image
              }}
            />
            <MapboxGL.PointAnnotation
              id="point1"
              coordinate={point1}
              title="asdfasfasdf"
            >
              {mapLoaded && (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Image
                    source={require("../../assets/images/pin-map.png")}
                    style={{
                      width: 40,
                      height: 40,
                      resizeMode: "contain",
                    }}
                  />
                </View>
              )}
            </MapboxGL.PointAnnotation>

            {/* Marker 2 */}
            <MapboxGL.PointAnnotation id="point2" coordinate={point2}>
              {/* <View style={styles.marker} /> */}
              {mapLoaded && (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: 50,
                    height: 50,
                  }}
                >
                  <Image
                    source={require("../../assets/images/restaurant.png")}
                    style={{
                      width: 40,
                      height: 40,
                      resizeMode: "contain",
                    }}
                  />
                </View>
              )}
            </MapboxGL.PointAnnotation>
            {routeCoordinates.length > 0 && (
              <MapboxGL.ShapeSource
                id="routeSource"
                shape={{
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates: routeCoordinates,
                  },
                }}
              >
                <MapboxGL.LineLayer
                  id="routeLayer"
                  style={{
                    lineColor: "#0f0094",
                    lineWidth: 4,
                  }}
                />
              </MapboxGL.ShapeSource>
            )}
          </MapboxGL.MapView>
        )}
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
            currentPosition={pos}
            labels={labels}
            renderStepIndicator={renderStepIndicator}
          />
          <View className="flex-row px-10 justify-between my-2 items-center">
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
                Mã đơn hàng:
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
            {orderData.receiveAt ? (
              <Text className="font-hnow64regular text-green-800 text-xs">
                Giao lúc: {`${formatDateTime(orderData.receiveAt)}`}
              </Text>
            ) : (
              <Text className="font-hnow64regular text-green-800 text-xs">
                Dự kiến giao:{" "}
                {`${convertIntTimeToString(orderData.startTime)} - ${convertIntTimeToString(orderData.endTime)}`}
              </Text>
            )}
          </View>
          <View className="flex-row justify-end px-10 py-1">
            {orderData.isOrderNextDay ? (
              <>
                <CalendarCheck2 color={"red"} size={16} />

                <Text className="text-xs text-red-400">
                  Đặt hàng cho ngày mai
                </Text>
              </>
            ) : (
              <>
                <CalendarCheck2 color={"red"} size={16} />
                <Text className="text-xs text-red-400">
                  Đặt hàng cho hôm nay
                </Text>
              </>
            )}
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
                  source={{
                    uri: orderData?.shopInfo?.logoUrl,
                  }}
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
                      if (orderData.status >= 5) {
                        router.push("/chat/" + orderData.id);
                      } else {
                        dispatch(
                          globalSlice.actions.customSnackBar({
                            style: {
                              color: "white",
                              icon: "camera",
                              backgroundColor: Colors.glass.red,
                              pos: {
                                top: 40,
                              },
                              actionColor: "yellow",
                            },
                          })
                        );

                        dispatch(
                          globalSlice.actions.openSnackBar({
                            message:
                              "Phòng nhắn tin chỉ mở khi đơn hàng được cửa hàng chuẩn bị 🥲",
                          })
                        );
                      }
                    }}
                  />
                  <IconButton
                    onPress={() => {
                      const url = `tel:${orderData?.shopInfo?.phoneNumber}`;
                      Linking.canOpenURL(url)
                        .then((supported) => {
                          return Linking.openURL(url);
                        })
                        .catch((err) => {
                          console.error("Error opening phone call:", err);
                        });
                    }}
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
            <View>
              <Text className="pl-7 text-lg font-bold">Thông tin giỏ hàng</Text>
            </View>
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
                  <View className="flex-1 flex-row gap-1">
                    <Utensils size={16} color={"blue"} />
                    <Text
                      className="flex-wrap flex-1 text-ellipsis"
                      numberOfLines={3}
                    >
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
                  <View className="gap-3 my-1 flex-row items-center">
                    {product.note && (
                      <>
                        <NotepadText size={12} color="green" />
                        <Text className="text-xs text-gray-500">
                          Ghi chú: {product.note}
                        </Text>
                      </>
                    )}
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Coins size={18} color={"red"} />
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
                  className="flex-row my-4 mx-7"
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
            <View className="px-7 mb-5">
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
                {getButtonAction()}
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
