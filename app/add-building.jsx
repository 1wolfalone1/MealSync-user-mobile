import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import api from "../api/api";
import { Colors, CommonConstants, Icons, Images } from "../constant";
import globalSlice from "../redux/slice/globalSlice";
import userInfoSlice from "../redux/slice/userSlice";
const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
};

export default function StartPage() {
  const dispatch = useDispatch();
  const [selectDormitoryId, setSelectDormitoryId] = useState(null);
  const [selectBuildingId, setSelectBuildingId] = useState(null);
  const [listAllDormitory, setListAllDormitory] = useState([]);
  const [listAllBuilding, setListAllBuilding] = useState([]);
  const [open, setOpen] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [state, setState] = useState(false);
  const [listBuilding, setListBuilding] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const handleGetAllDormitory = async () => {
    try {
      const res = await api.get(`/api/v1/dormitory/all`);
      const data = await res.data;
      const newList = data.value.map((i) => {
        return {
          label: i.name,
          value: i.id,
        };
      });
      setListAllDormitory(newList);
    } catch (e) {
      console.log("Get list all dormitory error: ", e);
    }
  };
  const handleGetAllBuilding = async () => {
    console.log(selectBuildingId);
    try {
      if (selectDormitoryId) {
        const res = await api.get(
          `/api/v1/dormitory/${selectDormitoryId}/building`
        );
        const data = await res.data;
        const newList = data.value.map((i) => {
          return {
            label: i.name,
            value: i.id,
          };
        });
        setListAllBuilding(newList);
      }
    } catch (e) {
      console.log("Get list all building error: ", e);
    }
  };
  const handleBuildingChange = (value) => {
    setSelectedBuilding(value);
  };

  useEffect(() => {
    handleGetAllDormitory();
  }, [state]);

  useEffect(() => {
    handleGetAllBuilding();
  }, [selectDormitoryId]);
  const handleRoute = async () => {
    try {
      if (selectBuildingId) {
        dispatch(
          globalSlice.actions.changeLoadings({
            isLoading: true,
            msg: "Đang đăng nhập",
          })
        );
        const res = await api.put("/api/v1/customer/building/update", {
          buildingId: selectBuildingId,
          isSetDefault: true,
        });
        const data = res.data;
        if (data.isSuccess) {
          const res2 = await api.get("/api/v1/customer/profile");
          const data2 = res2.data;
          if (data2.isSuccess) {
            dispatch(
              userInfoSlice.actions.changeUserInfo({
                info: data2.value,
                role: CommonConstants.USER_ROLE.USER,
              })
            );
            dispatch(
              globalSlice.actions.changeLoadings({
                isLoading: false,
                msg: "Đang đăng nhập",
              })
            );
            router.replace("/home");
          }
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
            message: "Vui lòng chọn địa chỉ để tiếp tục",
          })
        );
      }
    } catch (e) {
      dispatch(
        globalSlice.actions.changeLoadings({
          isLoading: false,
          msg: "Đang đăng nhập",
        })
      );

      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        className="absolute top-20 left-0 right-0 bottom-0 h-5/6 object-cover"
        resizeMode="stretch"
        source={Images.LogoCover}
      />
      <FadeInView className="w-full justify-center items-center">
        <View className="justify-center items-center mb-10">
          <Image
            className="w-52 h-52"
            resizeMode="contain"
            source={Icons.IconLight}
          />
          <Text className="text-3xl font-bold text-white">VFoody</Text>
        </View>
        <View className="items-center justify-center mb-8 w-full">
          <Text className="font-bold text-xl mb-4 text-white">
            Tạo mới địa chỉ nhận hàng
          </Text>
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
            value={selectDormitoryId}
            items={listAllDormitory}
            setOpen={setOpen}
            onChangeValue={(value) => {
              console.log(value);
              setSelectDormitoryId(value);
            }}
            setValue={setSelectDormitoryId}
            setItems={setListAllDormitory}
            placeholder={"Khu"}
          />
          <View
            style={{
              height: 20,
            }}
          />
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={openB}
            style={{
              borderColor: Colors.primaryBackgroundColor,
              width: "80%",
            }}
            zIndex={2000}
            zIndexInverse={2000}
            categorySelectable={true}
            placeholderStyle={{ color: "grey" }}
            dropDownContainerStyle={{
              backgroundColor: "white",

              borderColor: Colors.primaryBackgroundColor,
              width: "80%",
            }}
            textStyle={{}}
            value={selectBuildingId}
            items={listAllBuilding}
            setOpen={setOpenB}
            onChangeValue={(value) => {}}
            setValue={setSelectBuildingId}
            setItems={setListAllBuilding}
            placeholder={"Tòa"}
          />
        </View>
        <Button
          mode="contained-tonal"
          textColor={Colors.btnText}
          contentStyle={{
            paddingVertical: 8,
            width: "100%",
            backgroundColor: "white",
          }}
          labelStyle={{
            fontSize: 24,
            lineHeight: 27,
          }}
          onPress={handleRoute}
        >
          Bắt đầu
        </Button>
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: Colors.primaryBackgroundColor,
    paddingHorizontal: 1,
    gap: 60,
  },
});
