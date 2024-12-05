import { router } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Divider, HelperText, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { Colors } from "../../constant";
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
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(false);
  const [openB, setOpenB] = useState(false);
  const dispatch = useDispatch();

  const handleUpdateOrderInfo = (values) => {
    if (false) {
    } else {
      dispatch(
        orderSlice.actions.changeOrderInfoReorder({
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
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

  useEffect(() => {}, [state]);

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
