import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Formik } from "formik";
import { default as React, useState } from "react";
import { Image, Keyboard, ScrollView, Text, View } from "react-native";
import {
  Button,
  Divider,
  HelperText,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import api from "../../api/api";
import { Colors, CommonConstants, Images } from "../../constant";
import userInfoSlice from "../../redux/slice/userSlice";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(
      /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
      "Email không hợp lệ!"
    )
    .required("Vui lòng nhập email"),
  password: yup
    .string()
    .min(1, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(25, "Mật khẩu chỉ có tối đa 25 ký tự")
    /*     .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất một ký tự số (0-9)")
    .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái in thường (a-z)")
    .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái in hoa (A-Z)")
    .matches(
      /[^\w]/,
      "Mật khẩu phải chứa ít nhất một ký tự đặc biệt (`, ~, !, @, #, $, %, ^, &, *, ?)"
    ) */
    .required("Vui lòng nhập mật khẩu"),
});

const SignIn = () => {
  const [loginErrorGoogleMessage, setLoginErrorGoogleMessage] = useState("");
  const [isShowPassword, setIsShownPassword] = useState(false);
  const dispatch = useDispatch();
  const [message, setMessage] = useState();

  const handleLogin = async (payload) => {
   
    try {
      const responseData = await api.post("api/v1/auth/login", payload);
      const data = await responseData.data;
      console.log("data ne", data);
      handleLoginResponseData(
        data.value,
        data.isSuccess,
        data.error.code,
        data.error.message
      );
    } catch (error) {
      console.log("error ne", error);
    }
  };

  const handleLoginResponseData = async (
    data,
    isSuccess,
    errorCode,
    errorMessage
  ) => {
    try {
      if (isSuccess) {
        console.log(data)
        await AsyncStorage.setItem(
          "@token",
          data.tokenResponse.accessToken
        );
        dispatch(
          userInfoSlice.actions.changeUserInfo({
            info: data.accountResponse,
            role: CommonConstants.USER_ROLE.USER,
          })
        );
        router.push("/home");
      } else if (errorCode === "401") {
        setMessage(errorMessage);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fffcfc' }}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          handleLogin({
            ...values,
            loginContext: 1,
          });
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
          <View className="flex-col gap-2 mt-5 items-center">
            <View className="w-full flex-1 items-center">
              <TextInput
                style={{ backgroundColor: "transparent", width: "80%" }}
                type="flat"
                onBlur={handleBlur("email")}
                value={values.email}
                onChangeText={handleChange("email")}
                placeholder="Nhập email của bạn"
                onSubmitEditing={Keyboard.dismiss}
              />
              <View className="w-[80%]">
                <HelperText
                  type="error"
                  visible={touched.email && errors.email}
                >
                  {errors.email}{" "}
                </HelperText>
              </View>
            </View>
            <View className="w-full flex-1 items-center">
              <TextInput
                style={{ backgroundColor: "transparent", width: "80%" }}
                type="flat"
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
            <View className="w-[80%]">
              {message && (
                <HelperText type="error" className="text-center text-base">
                  {message}
                </HelperText>
              )}
            </View>
            <Button
              textColor={Colors.primaryBackgroundColor}
              mode="text"
              theme={{ roundness: 4 }}
              contentStyle={{
                paddingVertical: 8,
              }}
              labelStyle={{
                fontWeight: 700,
                fontSize: 16,
              }}
              onPress={() => {
                router.push("verify/forgot-password");
              }}
            >
              Quên Mật Khẩu?
            </Button>

            <Button
              buttonColor={Colors.primaryBackgroundColor}
              textColor={Colors.commonBtnText}
              mode="elevated"
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
              Đăng nhập
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
          <TouchableRipple
            className="bg-white rounded-3xl"
            style={{ width: "100%" }}
            borderless
            onPress={() => promptAsync()}
            rippleColor="rgba(0, 0, 0, .32)"
          >
            <View
              className="flex-row justify-between p-3  items-center rounded-full"
              style={{
                borderWidth: 1,
                borderColor: Colors.primaryBackgroundColor,
                width: "80%",
              }}
            >
              <Image
                className="h-[30] w-[30] mr-2"
                resizeMode="contain"
                source={Images.GoogleIcon}
              />

              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Đăng nhập bằng google
              </Text>

              <Image className="h-[30] w-[30] mr-2" resizeMode="contain" />
            </View>
          </TouchableRipple>
          <Text>{loginErrorGoogleMessage}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
