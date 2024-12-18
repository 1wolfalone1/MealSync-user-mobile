import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  HelperText,
  Snackbar,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import HeaderInForgot from "../../components/common/HeaderInForgot";
import { Colors } from "../../constant";
import globalSlice from "../../redux/slice/globalSlice";
import {
  persistSliceSelector,
} from "../../redux/slice/persistSlice";

export default function VerifyCode() {
  const {} = useSelector(persistSliceSelector);
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [message, setMessage] = useState();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const params = useLocalSearchParams();
  const emailTemp = params.email;
  const [inRequest, setInRequest] = useState(false);
  // Handle resend code when expired
  const handleResend = async () => {
    // Clear message and verification code
    setVerificationCode(["", "", "", ""]);
    setMessage();

    const payload = {
      email: emailTemp,
      verifyType: 3,
    };

    try {
      await api.post("/api/v1/auth/verify-code", payload);
      setVisible(true);
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
      console.log("error ne", e);
    }
  };

  const handleVerifyCode = async (code) => {
    console.log(emailTemp, " email ne");
    const payload = {
      isVerify: true,
      email: emailTemp,
      code: Number.parseInt(code),
      verifyType: 3,
    };

    try {
      
      setInRequest(true);
      const responseData = await api.post("/api/v1/auth/verify-code", payload);
      const data = await responseData.data;
      handleVerifyCodeResponseData(
        payload.code,
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
      console.log("error ne", e);
    } finally {
      setInRequest(false);
    }
  };

  const handleVerifyCodeResponseData = async (
    code,
    isSuccess,
    errorCode,
    errorMessage
  ) => {
    if (isSuccess) {
      router.push({
        pathname: "verify/reset-password",
        params: {
          email: emailTemp,
          code: code,
        },
      });
    } else if (errorCode === "400") {
      setMessage(errorMessage);
    }
  };

  const handleChange = (value, index) => {
    setMessage();
    setVerificationCode((prevCode) => {
      const newCode = [...prevCode];
      newCode[index] = value;
      return newCode;
    });

    if (value !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && verificationCode[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const onFormSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!verificationCode.join("")) {
        setMessage("Vui lòng nhập mã xác thực!");
      }
      handleVerifyCode(verificationCode.join(""));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <HeaderInForgot
        back="verify/forgot-password"
        title="Nhập mã xác thực"
        des="Vui lòng kiểm tra email để lấy mã xác thực"
      />
      <View className="w-full flex items-center justify-center">
        <View className="w-4/5 items-center justify-center flex flex-row gap-6">
          {verificationCode.map((digit, index) => (
            <TextInput
              style={{
                backgroundColor: "transparent",
                textAlign: "center",
                fontSize: 24,
              }}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={digit}
              dense
              maxLength={1}
              mode="flat"
              textColor={Colors.primaryBackgroundColor}
              activeUnderlineColor={Colors.primaryBackgroundColor}
              keyboardType="numeric"
              onChangeText={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </View>
        <View className="flex flex-row gap-1 mt-8">
          <Text>Bạn không nhận được mã?</Text>
          <TouchableRipple onPress={() => handleResend()}>
            <Text className="font-bold text-orange-600">Gửi lại</Text>
          </TouchableRipple>
        </View>
        <View className="w-[80%] mt-4">
          {message && (
            <HelperText type="error" className="text-center text-base">
              {message}
            </HelperText>
          )}
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
          className="mt-8"
          labelStyle={{
            fontFamily: "HeadingNow-64Regular",
            fontSize: 16,
            fontWeight: 700,
          }}
          onPress={onFormSubmit}
        >
          Xác thực
        </Button>
      </View>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: "Ok",
          onPress: () => {
            setVisible(false);
          },
          style: { color: "red" },
        }}
        className="mb-4 text-center bg-gray-500 mx-8 rounded-md text-lg text-white"
      >
        Kiểm tra email để lấy mã xác thực mới!
      </Snackbar>
    </ScrollView>
  );
}
