import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button, Modal, Portal, RadioButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import api from "../api/api";
import { Colors } from "../constant";
import colors from "../constant/colors";
import globalSlice from "../redux/slice/globalSlice";
import { loadInfo } from "../redux/slice/userSlice";

const Map = () => {
  const [listBuilding, setListBuilding] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const [openModelCreateBuilding, setOpenModelCreateBuilding] = useState(false);
  const [selectDormitoryId, setSelectDormitoryId] = useState(null);
  const [selectBuildingId, setSelectBuildingId] = useState(null);
  const [listAllDormitory, setListAllDormitory] = useState([]);
  const [listAllBuilding, setListAllBuilding] = useState([]);

  const [open, setOpen] = useState(false);
  const [state, setState] = useState(false);
  const [openB, setOpenB] = useState(false);

  const dispatch = useDispatch();

  const handleGetListBuilding = async () => {
    try {
      const res = await api.get("/api/v1/customer/building");
      const data = await res.data;
      setListBuilding(data.value);
    } catch (e) {
      console.log("Get list building error: ", e);
    }
  };
  const handleCreateNewBuilding = async () => {
    try {
      const res = await api.put("/api/v1/customer/building/update", {
        buildingId: selectBuildingId,
      });
      const data = await res.data;
      if (data.isSuccess) {
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
            message: "Thêm địa chỉ nhận hàng thành công",
          })
        );
        setState(!state);
        setOpenModelCreateBuilding(false);
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
          globalSlice.actions.openSnackBar({
            message: "Đơn hàng phải lớn hơn 0",
          })
        );
      }
    } catch (e) {
      console.log("Create new building error: ", e);
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
        globalSlice.actions.openSnackBar({
          message: "Tạo mới địa chỉ nhận hàng thất bại",
        })
      );
    }
  };

  const handleUpdateOrderInfo = (values) => {
    if (false) {
    } else {
      dispatch(
        orderSlice.actions.changeOrderInfo({
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          buildingId: selectedBuilding,
        })
      );
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
          message: "Thay đổi địa chỉ đơn hàng thành công <3",
        })
      );
      router.back();
    }
  };
  const handleBuildingChange = async (value) => {
    try {
      console.log(value, 'asdf');
      const res = await api.put("/api/v1/customer/building/update", {
        buildingId: value,
          isSetDefault: true
      });
      const data = await res.data;
      if (data.isSuccess) {
        setSelectedBuilding(value);
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
            message: "Đổi địa chỉ mặc định thành công",
          })
        );
        dispatch(loadInfo())
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
            message: "Đổi địa chỉ mặc định không thành công",
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
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
  useEffect(() => {
    handleGetListBuilding();
    handleGetAllDormitory();
  }, [state]);

  useEffect(() => {
    handleGetAllBuilding();
  }, [selectDormitoryId]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 10,
      }}
    >
      <Portal>
        <Modal
          visible={openModelCreateBuilding}
          onDismiss={() => setOpenModelCreateBuilding(false)}
          contentContainerStyle={{
            borderRadius: 20,
            backgroundColor: "white",
            padding: 20,
            marginHorizontal: 20,
          }}
        >
          <Text className="font-bold text-xl mb-4">
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
          <View className="flex-row justify-end gap-2 mt-2">
            <Button
              mode="contained"
              contentStyle={{
                backgroundColor: "#000000",
              }}
              onPress={() => setOpenModelCreateBuilding(false)}
            >
              Hủy
            </Button>
            <Button
              mode="contained-tonal"
              contentStyle={{}}
              onPress={handleCreateNewBuilding}
            >
              Thêm
            </Button>
          </View>
        </Modal>
      </Portal>
      <RadioButton.Group
        onValueChange={handleBuildingChange}
        value={selectedBuilding}
      >
        <View className="gap-4 mt-0 mb-4">
          {listBuilding &&
            Array.isArray(listBuilding) &&
            listBuilding.map((i) => {
              return (
                <View className="flex-row justify-between items-center">
                  <Text>{i.buildingName}</Text>
                  <RadioButton.Android
                    value={i.buildingId}
                    status={i.isDefault ? "checked" : "unchecked"}
                    color={colors.primaryBackgroundColor}
                  />
                </View>
              );
            })}
        </View>
      </RadioButton.Group>
      <Button
        mode="text"
        onPress={() => {
          setOpenModelCreateBuilding(true);
        }}
      >
        Thêm địa chỉ nhận hàng
      </Button>
    </SafeAreaView>
  );
};

export default Map;
