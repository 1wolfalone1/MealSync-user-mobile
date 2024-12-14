import { router } from "expo-router";
import { Formik } from "formik";
import { Image } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import api from "../../api/api";
import HeaderInForgot from "../../components/common/HeaderInForgot";
import { Colors, Images } from "../../constant";
import globalSlice from "../../redux/slice/globalSlice";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(
      /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
      "Email không hợp lệ!"
    )
    .required("Vui lòng nhập email"),
});

export default function ForgotPassword() {
  const [message, setMessage] = useState();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [inRequest, setInRequest] = useState(false);
  const handleForgotPassword = async (values) => {
    const payload = {
      email: values.email,
      verifyType: 3,
    };

    try {
      setInRequest(true);
      const responseData = await api.post("/api/v1/auth/send-code", payload);
      const data = await responseData.data;
      setEmail(values.email);
      handleForgotPasswordResponseData(
        data.value,
        data.isSuccess,
        data.error.code,
        data.error.message,
        values.email
      );
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
              message: "Có gì đó sai sai! Mong bạn thử lại sau 😞",
            })
          );
        }
      }
      console.log("error ne", error);
    } finally {
      setInRequest(false);
    }
  };

  const handleForgotPasswordResponseData = async (
    value,
    isSuccess,
    errorCode,
    errorMessage,
    email
  ) => {
    if (isSuccess) {
      router.push({
        pathname: "verify/verify-code",
        params: { email: email },
      });
    } else if (errorCode === "400") {
      setMessage(errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="bg-bg-100 flex-1 h-full">
        <Image
          className=" h-full absolute top-0 left-0 right-0 bottom-0"
          resizeMode="stretch"
          source={Images.LogoCoverDark}
        />
        <HeaderInForgot
          back="/"
          title="Quên mật khẩu"
          des="Nhập email bạn muốn lấy lại mật khẩu"
        />
        <Formik
          initialValues={{ email: "" }}
          onSubmit={(values) => {
            handleForgotPassword(values);
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
            <View className="flex gap-4 justify-center items-center">
              <View className="w-full items-center">
                <TextInput
                  style={{ backgroundColor: "transparent", width: "80%" }}
                  type="flat"
                  onBlur={handleBlur("email")}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  placeholder="Nhập email của bạn"
                />
                <View className="w-[80%]">
                  <HelperText
                    type="error"
                    visible={touched.email && errors.email}
                  >
                    {errors.email}{" "}
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
                mode="contained-tonal"
                disabled={inRequest}
                loading={inRequest}
                style={{ width: "80%" }}
                theme={{ roundness: 2 }}
                contentStyle={{
                  paddingVertical: 4,
                }}
                labelStyle={{
                  fontFamily: "HeadingNow-64Regular",
                  fontSize: 16,
                  fontWeight: 700,
                }}
                onPress={handleSubmit}
              >
                Lấy lại mật khẩu
              </Button>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}
