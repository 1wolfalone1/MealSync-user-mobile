import { router } from "expo-router";
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
import persistSlice, {
  persistSliceSelector,
} from "../../redux/slice/persistSlice";

export default function VerifyCode() {
  const { emailTemp } = useSelector(persistSliceSelector);
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [message, setMessage] = useState();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  // Handle resend code when expired
  const handleResend = async () => {
    // Clear message and verification code
    setVerificationCode(["", "", "", ""]);
    setMessage();

    const payload = {
      email: emailTemp,
      verifyType: 1,
    };

    try {
      await api.post("/api/v1/auth/send-code", payload);
      setVisible(true);
    } catch (error) {
      console.log("error ne", error);
    }
  };

  const handleVerifyCode = async (code) => {
    const payload = {
      email: emailTemp,
      code: Number.parseInt(code),
      isVerify: true,
      verifyType: 1,
    };

    try {
      const responseData = await api.post("/api/v1/auth/verify-code", payload);
      const data = await responseData.data;
      handleVerifyCodeResponseData(
        data.isSuccess,
        data.error.code,
        data.error.message
      );
    } catch (error) {
      console.log("error ne", error);
    }
  };

  const handleVerifyCodeResponseData = async (
    isSuccess,
    errorCode,
    errorMessage
  ) => {
    if (isSuccess) {
      console.log("verifyCodeResponse")
      dispatch(persistSlice.actions.saveIsSignup(true));
      router.replace('/');
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
      console.log("sahdosa", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <HeaderInForgot
        back="/"
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
          mode="elevated"
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
