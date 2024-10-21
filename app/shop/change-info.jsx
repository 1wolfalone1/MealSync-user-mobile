import { router } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  Button,
  Divider,
  HelperText,
  Modal,
  Portal,
  RadioButton,
  TextInput,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import api from "../../api/api";
import { Colors } from "../../constant";
import colors from "../../constant/colors";
import globalSlice from "../../redux/slice/globalSlice";
import orderSlice, { orderSelector } from "../../redux/slice/orderSlice";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[400],

    shadowOpacity: 0.7,
    elevation: 10,
  },
});
const validationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(
      /((^(\\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/,
      "Số điện thoại không hợp lệ!"
    )
    .required("Vui lòng nhập số điện thoại"),
  fullName: yup.string().required("Vui lòng nhập họ và tên"),
});
const ChangeInfoPage = () => {
  const { orderInfo } = useSelector(orderSelector);
  const [listBuilding, setListBuilding] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  
  const [openModelCreateBuilding, setOpenModelCreateBuilding] = useState(false);
  const [selectDormitoryId, setSelectDormitoryId] = useState(null);
  const [selectBuildingId, setSelectBuildingId] = useState(null);
  const [listAllDormitory, setListAllDormitory] = useState([]);
  const [listAllBuilding, setListAllBuilding] = useState([]);

  const [open, setOpen] = useState(false);
  const [state, setState] = useState(false)
  const [openB, setOpenB] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [openDropDownListDormitory, setOpenDropDownListDormitory] =
    useState(false);
  const [openDropDownListBuilding, setOpenDropDownListBuilding] =
    useState(false);
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
        setState(!state)
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
        globalSlice.actions.openSnackBar({ message: "Tạo mới địa chỉ nhận hàng thất bại" })
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
  const handleBuildingChange = (value) => {
    setSelectedBuilding(value);
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
    <ScrollView
      horizontal={true}
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "white",
        padding: 10,
        flexDirection: "column",
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
      <View className="py-2 items-center">
        <Text className="font-hnow65medium text-lg">
          Thay đổi thông tin giao hàng
        </Text>
        <Divider className="w-full h-[1] my-4" />
      </View>
      <View
        className="flex-1"
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <Formik
          initialValues={{
            phoneNumber: orderInfo.phoneNumber,
            fullName: orderInfo.fullName,
            building: orderInfo.buildingId,
          }}
          onSubmit={(values) => {
            console.log("----------------------submit--------------------");
            handleUpdateOrderInfo(values);
          }}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <View className="flex-row gap-2 mb-10">
                <View className="flex-1">
                  <TextInput
                    mode="outlined"
                    onChangeText={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                    label={"Họ và tên"}
                    value={values.fullName}
                  />
                  <HelperText
                    type="error"
                    visible={touched.fullName && errors.fullName}
                  >
                    {errors.fullName}
                  </HelperText>
                </View>
                <View className="flex-1">
                  <TextInput
                    mode="outlined"
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    label={"Số điện thoại"}
                    value={values.phoneNumber}
                  />
                  <HelperText
                    type="error"
                    visible={touched.phoneNumber && errors.phoneNumber}
                  >
                    {errors.phoneNumber}
                  </HelperText>
                </View>
              </View>
              <View
                className=""
                style={{
                  flex: 1,
                  borderRadius: 24,
                  overflow: "hidden",
                }}
              >
                <RadioButton.Group
                  onValueChange={handleBuildingChange}
                  value={selectedBuilding}
                >
                  <Text className="text-lg font-bold my-1">
                    Chọn địa chỉ giao
                  </Text>
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
              </View>
              <View className="flex-row justify-end gap-2 pt-5">
                <Button
                  mode="outlined"
                  labelStyle={{
                    fontSize: 18,
                    color: Colors.primaryBackgroundColor,
                  }}
                  onPress={() => router.back()}
                >
                  Hủy
                </Button>
                <Button
                  mode="elevated"
                  labelStyle={{
                    fontSize: 18,
                    color: "black",
                  }}
                  onPress={handleSubmit}
                >
                  Lưu
                </Button>
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default ChangeInfoPage;
