import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  Button,
  Dialog,
  Divider,
  Portal,
  RadioButton,
  Switch,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import api from "../api/api";
import { Colors } from "../constant";
import colors from "../constant/colors";
import globalSlice from "../redux/slice/globalSlice";
import orderSlice from "../redux/slice/orderSlice";
import { convertIntTimeToString } from "../utils/MyUtils";

const FormReorder = () => {
  const params = useLocalSearchParams();
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedOperatingSlot, setSelectedOperatingSlot] = useState();
  const [listOperatingSlots, setListOperatingSlots] = useState([]);
  const [open, setOpen] = useState(false);
  const [shopInfo, setShopInfo] = useState(null);
  const [listBuilding, setListBuilding] = useState([]);
  const [isRequest, setIsRequest] = useState(false);
  const [disable, setDisable] = useState(false);
  const dispatch = useDispatch();
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [messageReorder, setMessageReorder] = React.useState("");
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  useEffect(() => {
    handleGetListBuilding();
    handleGetShopInfo();
  }, []);
  const handleGetShopInfo = async () => {
    try {
      const res = await api.post("/api/v1/customer/re-order/food", {
        isGetShopInfo: true,
        orderId: params.orderId,
      });
      const data = await res.data;
      console.log(data, "shopInfo");
      if (!data.value.isAllowReOrder) {
        setVisible(true);
        setMessageReorder(data.value.messageNotAllow);
        return;
      }
      if (
        data &&
        data.value &&
        data.value.shopInfo &&
        Array.isArray(data.value.shopInfo.operatingSlots)
      ) {
        const mapList = data.value.shopInfo.operatingSlots.map((i) => {
          return {
            label:
              i.title +
              " từ  " +
              convertIntTimeToString(i.startTime) +
              " đến " +
              convertIntTimeToString(i.endTime),
            value: i.id,
          };
        });
        setListOperatingSlots(mapList);
      }
    } catch (e) {
      console.log("Get shop info error: ", e);
    }
  };
  const handleGetListBuilding = async () => {
    try {
      const res = await api.get("/api/v1/customer/building");
      const data = await res.data;
      setListBuilding(data.value);
    } catch (e) {
      console.log("Get list building error: ", e);
    }
  };
  const handleBuildingChange = (value) => {
    setSelectedBuilding(value);
  };
  const handleReorder = async () => {
    try {
      setIsRequest(true);
      const res = await api.post("/api/v1/customer/re-order/food", {
        isGetShopInfo: false,
        orderId: params.orderId,
        buildingOrderId: selectedBuilding,
        operatingSlotId: selectedOperatingSlot,
        isOrderForNextDay: isSwitchOn,
      });
      const data = await res.data;
      console.log(data, "data reorder");
      if (data.isSuccess) {
        if (data.value.isAllowReOrder) {
          dispatch(orderSlice.actions.changeDataReorder(data.value));
          dispatch(
            orderSlice.actions.changePreDataReorder({
              orderId: params.orderId,
              buildingOrderId: selectedBuilding,
              operatingSlotId: selectedOperatingSlot,
              isOrderForNextDay: isSwitchOn,
            })
          );
          console.log(data.value);
          router.push({
            pathname: "/shop/order-reorder",
            params: {
              orderTomorrow: isSwitchOn,
            },
          });
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
              message: data.value.messageNotAllow,
            })
          );
        }
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
            message: data.message,
          })
        );
      }
      setIsRequest(false);
    } catch (e) {
      setIsRequest(false);
      console.error("Reorder error: ", e);
    }
  };
  useEffect(() => {
    if (selectedOperatingSlot == null || selectedBuilding == null) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [selectedOperatingSlot, selectedBuilding]);
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => router.back();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Không thể đặt lại đơn</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{messageReorder}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Trở lại</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView>
        <View className="flex-row justify-end items-center pb-2">
          <Text
            className="text-base text-gray-400"
            style={{
              color: isSwitchOn ? "blue" : "#6b6464",
            }}
          >
            Đặt hàng cho ngày mai
          </Text>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </View>
        <View className="mx-4" style={{}}>
          <RadioButton.Group
            onValueChange={handleBuildingChange}
            value={selectedBuilding}
          >
            <Text className="text-lg font-bold my-1">Chọn địa chỉ giao</Text>
            <Divider />
            <View className="gap-4 mt-0 mb-4">
              {listBuilding &&
                Array.isArray(listBuilding) &&
                listBuilding.map((i) => {
                  return (
                    <View className="flex-row justify-between items-center">
                      <Text>{i.buildingName}</Text>
                      <RadioButton.Android
                        value={i.buildingId}
                        color={colors.primaryBackgroundColor}
                      />
                    </View>
                  );
                })}
            </View>
          </RadioButton.Group>
          <View className="my-4">
            <Divider />
            <Text className="text-lg font-bold my-1">
              Chọn khung giờ nhận hàng
            </Text>

            <Divider />
          </View>
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={open}
            style={{
              borderColor: Colors.primaryBackgroundColor,
              width: "100%",
            }}
            zIndex={3000}
            zIndexInverse={1000}
            categorySelectable={true}
            placeholderStyle={{ color: "grey" }}
            dropDownContainerStyle={{
              backgroundColor: "white",

              borderColor: Colors.primaryBackgroundColor,
              width: "100%",
            }}
            textStyle={{}}
            value={selectedOperatingSlot}
            items={listOperatingSlots}
            setOpen={setOpen}
            onChangeValue={(value) => {
              setSelectedOperatingSlot(value);
            }}
            setValue={setSelectedOperatingSlot}
            setItems={setListOperatingSlots}
            placeholder={"Khung giờ giao hàng"}
          />
        </View>
        <View className="px-4 mt-8 mb-8">
          <Button
            mode="contained-tonal"
            textColor="white"

            buttonColor={Colors.primaryBackgroundColor}
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
            disabled={isRequest || disable}
            loading={isRequest}
            onPress={handleReorder}
          >
            Đặt lại đơn hàng
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FormReorder;
