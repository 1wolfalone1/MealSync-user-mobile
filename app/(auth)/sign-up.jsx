import { router } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { Keyboard, ScrollView, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button, Divider, HelperText, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import api from "../../api/api";
import { Colors } from "../../constant";
import globalSlice from "../../redux/slice/globalSlice";
import persistSlice from "../../redux/slice/persistSlice";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(
      /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
      "Email không hợp lệ!"
    )
    .max(100, "Email chỉ có tối đa 100 ký tự")
    .required("Vui lòng nhập email"),
  fullName: yup
    .string()
    .max(50, "Họ và tên chỉ có tối đa 50 ký tự")
    .required("Vui lòng nhập họ và tên"),
  phoneNumber: yup
    .string()
    .matches(
      /((^(\\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/,
      "Số điện thoại không hợp lệ!"
    )
    .required("Vui lòng nhập số điện thoại"),
  password: yup
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(50, "Mật khẩu chỉ có tối đa 50 ký tự")
    .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất một ký tự số (0-9)")
    .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái in thường (a-z)")
    .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái in hoa (A-Z)")
    .matches(
      /[^\w]/,
      "Mật khẩu phải chứa ít nhất một ký tự đặc biệt (`, ~, !, @, #, $, %, ^, &, *, ?)"
    )
    .required("Vui lòng nhập mật khẩu"),
  confirmPassword: yup
    .string()
    .max(50, "Mật khẩu chỉ có tối đa 50 ký tự")
    .oneOf([yup.ref("password"), null], "Mật khẩu không khớp")
    .required("Vui lòng nhập lại mật khẩu"),
});
const SignUp = () => {
  const dispatch = useDispatch();
  const [loginErrorGoogleMessage, setLoginErrorGoogleMessage] = useState("");
  const [isShowPassword, setIsShownPassword] = useState(false);
  const [isShowConfirmPassword, setIsShownConfirmPassword] = useState(false);
  const [message, setMessage] = useState();
  const [openB, setOpenB] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genders, setGenders] = useState([
    {
      label: "Nam",
      value: 1,
    },
    {
      label: "Nữ",
      value: 2,
    },
    {
      label: "Không xác định",
      value: 3,
    },
  ]);

  const [selectGender, setSelectGender] = useState(1);

  const handleSignUp = async (values) => {
    setLoading(true);
    const payload = {
      email: values.email,
      phoneNumber: values.phoneNumber,
      password: values.password,
      fullName: values.fullName,
      gender: selectGender,
    };
    try {
      const responseData = await api.post(
        "/api/v1/auth/customer-register",
        payload
      );
      const data = await responseData.data;
      console.log(data);
      handleSignUpResponseData(
        data.value,
        data.isSuccess,
        data.error.code,
        data.error.message
      );
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.status == 400) {
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
              message: e.response?.data?.error?.message,
            })
          );
        }
      }
      console.log("error ne", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpResponseData = async (
    value,
    isSuccess,
    errorCode,
    errorMessage
  ) => {
    try {
      if (isSuccess) {
        dispatch(persistSlice.actions.saveEmailTemp(value.email));
        router.push("verify/verify-sign-up");
      } else if (errorCode === "400") {
        setMessage(errorMessage);
      }
    } catch (e) {
      console.log("error ne", e);
    }
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}>
      <Formik
        initialValues={{
          phoneNumber: "",
          email: "",
          password: "",
          confirmPassword: "",
          fullName: "",
        }}
        onSubmit={(values) => {
          handleSignUp(values);
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
          <View className="flex gap-1 mt-5 items-center">
            <View className="w-full flex-1 items-center">
              <TextInput
                style={{ backgroundColor: "transparent", width: "80%" }}
                mode="outlined"
                dense
                onBlur={handleBlur("email")}
                value={values.email}
                onChangeText={handleChange("email")}
                keyboardType="email-address"
                placeholder="Nhập email của bạn"
              />
              <View className="w-[80%]">
                <HelperText
                  type="error"
                  visible={touched.email && errors.email}
                >
                  {errors.email}
                </HelperText>
              </View>
            </View>
            <View className="w-full flex-1 items-center">
              <TextInput
                style={{ backgroundColor: "transparent", width: "80%" }}
                type="flat"
                mode="outlined"
                dense
                onBlur={handleBlur("fullName")}
                value={values.fullName}
                onChangeText={handleChange("fullName")}
                keyboardType="email-address"
                placeholder="Nhập họ và tên của bạn"
                onSubmitEditing={Keyboard.dismiss}
              />
              <View className="w-[80%]">
                <HelperText
                  type="error"
                  visible={touched.fullName && errors.fullName}
                >
                  {errors.fullName}
                </HelperText>
              </View>
            </View>
            <View className="w-full flex-1 items-center">
              <TextInput
                style={{ backgroundColor: "transparent", width: "80%" }}
                type="flat"
                dense
                mode="outlined"
                onBlur={handleBlur("phoneNumber")}
                value={values.phoneNumber}
                onChangeText={handleChange("phoneNumber")}
                keyboardType="phone-pad"
                placeholder="Nhập số điện thoại của bạn"
                onSubmitEditing={Keyboard.dismiss}
              />
              <View className="w-[80%]">
                <HelperText
                  type="error"
                  visible={touched.phoneNumber && errors.phoneNumber}
                >
                  {errors.phoneNumber}{" "}
                </HelperText>
              </View>
            </View>
            <View className="mb-3">
              <DropDownPicker
                listMode="SCROLLVIEW"
                open={openB}
                style={{
                  borderColor: Colors.primaryBackgroundColor,
                  width: '80%'
                }}
                zIndex={2000}
                zIndexInverse={2000}
                categorySelectable={true}
                placeholderStyle={{ color: "grey" }}
                dropDownContainerStyle={{
                  backgroundColor: "white",
                  width: "80%",
                  borderColor: Colors.primaryBackgroundColor,
                }}
                textStyle={{}}
                value={selectGender}
                items={genders}
                setOpen={setOpenB}
                onChangeValue={(value) => {}}
                setValue={setSelectGender}
                setItems={setGenders}
                placeholder={"Giới tính"}
              />
            </View>
            <View className="w-full flex-1 items-center">
              <TextInput
                style={{ backgroundColor: "transparent", width: "80%" }}
                type="flat"
                dense
                mode="outlined"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry={!isShowPassword}
                right={
                  !isShowPassword ? (
                    <TextInput.Icon
                      icon="eye-off"
                      onPress={() => setIsShownPassword(true)}
                    />
                  ) : (
                    <TextInput.Icon
                      icon="eye"
                      onPress={() => setIsShownPassword(false)}
                    />
                  )
                }
                placeholder="Nhập mật khẩu của bạn"
              />

              <View className="w-[80%]">
                <HelperText
                  type="error"
                  visible={touched.password && errors.password}
                >
                  {errors.password}
                </HelperText>
              </View>
            </View>
            <View className="w-full flex-1 items-center mb-5">
              <TextInput
                style={{ backgroundColor: "transparent", width: "80%" }}
                type="flat"
                dense
                mode="outlined"
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                secureTextEntry={!isShowConfirmPassword}
                right={
                  !isShowConfirmPassword ? (
                    <TextInput.Icon
                      icon="eye-off"
                      onPress={() => setIsShownConfirmPassword(true)}
                    />
                  ) : (
                    <TextInput.Icon
                      icon="eye"
                      onPress={() => setIsShownConfirmPassword(false)}
                    />
                  )
                }
                placeholder="Nhập lại mật khẩu"
              />
              <View className="w-[80%]">
                <HelperText
                  type="error"
                  visible={touched.confirmPassword && errors.confirmPassword}
                >
                  {errors.confirmPassword}
                </HelperText>
              </View>
              <View className="w-[80%]">
                {message && (
                  <HelperText type="error" className="text-center text-base">
                    {message}
                  </HelperText>
                )}
              </View>
            </View>
            <Button
              buttonColor={Colors.primaryBackgroundColor}
              textColor={Colors.commonBtnText}
              loading={loading}
              mode="contained-tonal"
              disabled={loading}
              elevation={2}
              
              style={{ width: "80%" }}
              theme={{ roundness: 5 }}
              contentStyle={{
                paddingVertical: 8,
              }}
              labelStyle={{
                fontSize: 18,
                lineHeight: 20,
              }}
              onPress={handleSubmit}
            >
              Đăng ký
            </Button>
          </View>
        )}
      </Formik>
      <View className=" justify-between items-center">
        <Divider
          style={{
            width: "70%",
            height: 1,
            marginVertical: 50,
          }}
        />
        <View className="items-start">
          <Text>{loginErrorGoogleMessage}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
