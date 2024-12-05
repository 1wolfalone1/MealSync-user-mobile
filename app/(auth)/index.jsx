import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  router,
  useLocalSearchParams,
  useRootNavigationState,
} from "expo-router";
import { Formik } from "formik";
import { default as React, useEffect, useState } from "react";
import { Image, Keyboard, ScrollView, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  Button,
  Divider,
  HelperText,
  Modal,
  Portal,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import api from "../../api/api";
import { Colors, CommonConstants, Images } from "../../constant";
import globalSlice from "../../redux/slice/globalSlice";
import userInfoSlice from "../../redux/slice/userSlice";

GoogleSignin.configure({
  webClientId:
    "165787317331-1ic454psf9ne9d6rkuiksmmn4kroson2.apps.googleusercontent.com",
});
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
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const [message, setMessage] = useState();
  const [user, setUser] = useState();
  const [stateLogin, setStateLogin] = useState(true);
  const [dataUserLogin, setDataUserLogin] = useState({});
  const [errorPhoneNumber, setErrorPhoneNUmber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const rootNavigationState = useRootNavigationState();
  useEffect(() => {
    checkLogin();
  }, [stateLogin]);
  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      console.log(token, " tokennnnnnnnnn ne ");
      if (token) {
        router.navigate("/home");
      }
    } catch (err) {
      console.log(err, "error check login");
    }
  };
  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      dispatch(
        globalSlice.actions.changeLoadings({
          isLoading: true,
          msg: "Đang đăng nhập",
        })
      );
      // Try the new style of google-sign in result, from v13+ of that module
      idToken = signInResult.data?.idToken;
      if (!idToken) {
        // if you are using older versions of google-signin, try old style result
        idToken = signInResult.idToken;
      }
      if (!idToken) {
        throw new Error("No ID token found");
      }
      console.log(idToken, "Google Sign In Result");
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(
        signInResult.data.idToken
      );
      GoogleSignin.signOut();
      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (e) {
      dispatch(
        globalSlice.actions.changeLoadings({
          isLoading: true,
          msg: "Đang đăng nhập",
        })
      );
      console.error(e);
    }
  }
  // Handle user state changes

  function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /((^(\\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/;
    const errorMessage = "Số điện thoại không hợp lệ!";

    if (phoneRegex.test(phoneNumber)) {
      return { valid: true, message: "Số điện thoại hợp lệ!" };
    } else {
      return { valid: false, message: errorMessage };
    }
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      console.log("User state changed", user);
      try {
        if (user) {
          const idToken = await user.getIdTokenResult(true);
          const res = await api.post("/api/v1/auth/login-google", {
            idToken: idToken.token,
          });
          try {
            auth().signOut();
          } catch (e) {
            console.log(e);
          }
          const data = await res.data;
          console.log(data, " asdfasd daaaaaaaaaaaaaaaaa");
          if (data.isSuccess) {
            dispatch(
              globalSlice.actions.changeLoadings({
                isLoading: false,
                msg: "Đang đăng nhập",
              })
            );
            dispatch(
              userInfoSlice.actions.changeUserInfo({
                info: data.value.accountResponse,
                role: CommonConstants.USER_ROLE.USER,
              })
            );

            console.log(data.value, "dta login gooogle");
            await AsyncStorage.setItem(
              "@token",
              data.value.tokenResponse.accessToken
            );
            setStateLogin((data) => !data);
          } else if (data.isWarning) {
            dispatch(
              globalSlice.actions.changeLoadings({
                isLoading: false,
                msg: "Đang đăng nhập",
              })
            );
            setDataUserLogin(data.value);
            if (!openModelCreateBuilding) {
              setOpenModelCreateBuilding(true);
            }
            console.log("user must loginnnnnnnnnnnnnnn");
          }
        }
      } catch (e) {
        dispatch(
          globalSlice.actions.changeLoadings({
            isLoading: false,
            msg: "Đang đăng nhập",
          })
        );
        console.log(e, " error get id token");
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);
  const handleLogin = async (payload) => {
    try {
      dispatch(
        globalSlice.actions.changeLoadings({
          isLoading: true,
          msg: "Đang đăng nhập",
        })
      );
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
      dispatch(
        globalSlice.actions.changeLoadings({
          isLoading: false,
          msg: "Đang đăng nhập",
        })
      );
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
        if (data.accountResponse.isSelectedBuilding) {
          console.log(data);
          await AsyncStorage.setItem("@token", data.tokenResponse.accessToken);
          dispatch(
            userInfoSlice.actions.changeUserInfo({
              info: data.accountResponse,
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
        } else {
          dispatch(
            globalSlice.actions.changeLoadings({
              isLoading: false,
              msg: "Đang đăng nhập",
            })
          );
          await AsyncStorage.setItem("@token", data.tokenResponse.accessToken);
          router.push("/add-building");
        }
      } else if (errorCode === "401") {
        dispatch(
          globalSlice.actions.changeLoadings({
            isLoading: false,
            msg: "Đang đăng nhập",
          })
        );
        setMessage(errorMessage);
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
  const [listAllDormitory, setListAllDormitory] = useState([]);
  const [listAllBuilding, setListAllBuilding] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectDormitoryId, setSelectDormitoryId] = useState(null);
  const [selectBuildingId, setSelectBuildingId] = useState(null);

  const [openModelCreateBuilding, setOpenModelCreateBuilding] = useState(false);
  const [state, setState] = useState(false);
  const [openB, setOpenB] = useState(false);
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
    handleGetAllDormitory();
  }, [state]);

  const [inRequest, setInRequest] = useState(false);
  useEffect(() => {
    handleGetAllBuilding();
  }, [selectDormitoryId]);
  const [errorBuilding, setErrorBuilding] = useState("");
  const handleCreateNewUserAfterLoginGoogle = async () => {
    let isValid = true;
    if (
      selectBuildingId == null ||
      selectBuildingId == 0 ||
      !selectBuildingId
    ) {
      setErrorBuilding("Cần chọn địa!");
      isValid = false;
    }
    const isValidPhone = validatePhoneNumber(phoneNumber);
    if (!isValidPhone.valid) {
      setErrorPhoneNUmber(isValidPhone.message);
      isValid = false;
    }
    if (isValid) {
      setInRequest(true);
      try {
        const res = await api.post("/api/v1/auth/register-google", {
          ...dataUserLogin,
          phoneNumber: phoneNumber,
          buildingId: selectBuildingId,
        });
        const data = await res.data;
        if (data.isSuccess) {
          setOpenModelCreateBuilding(false);
          dispatch(
            globalSlice.actions.changeLoadings({
              isLoading: false,
              msg: "Đang đăng nhập",
            })
          );
          dispatch(
            userInfoSlice.actions.changeUserInfo({
              info: data.value.accountResponse,
              role: CommonConstants.USER_ROLE.USER,
            })
          );

          console.log(data.value, "dta login gooogle");
          await AsyncStorage.setItem(
            "@token",
            data.value.tokenResponse.accessToken
          );
          setStateLogin((i) => !i);

          setInRequest(false);
        } else {
          setInRequest(false);
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
              message: data.error.message,
            })
          );
        }
      } catch (e) {
        setInRequest(false);
        console.log(e, "Unexpected error second time validation");
      }
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fffcfc" }}
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
            Nhập thông tin để tạo tài khoản
          </Text>
          <Divider />
          <Text className="font-bold text-lg my-1">Chọn địa chỉ</Text>
          <Divider className="mb-2" />

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
          <View className="h-100">
            <HelperText type="error" visible={errorBuilding}>
              {errorBuilding}
            </HelperText>
          </View>

          <Divider className="mt-5" />
          <Text className="font-bold text-lg my-1">Chọn số điện thoại</Text>
          <Divider className="mb-2" />
          <View className="w-full">
            <TextInput
              style={{ backgroundColor: "transparent", width: "80%" }}
              mode="outlined"
              dense
              value={phoneNumber}
              onChangeText={(value) => {
                const isValid = validatePhoneNumber(value);
                console.log(value, isValid, "sdfasfd");
                if (!isValid.valid) {
                  setErrorPhoneNUmber(isValid.message);
                } else {
                  setErrorPhoneNUmber("");
                }
                setPhoneNumber(value);
              }}
              keyboardType="phone-pad"
              placeholder="Nhập số điện thoại của bạn"
              onSubmitEditing={Keyboard.dismiss}
            />
            <View className="w-[80%]">
              <HelperText type="error" visible={errorPhoneNumber}>
                {errorPhoneNumber}
              </HelperText>
            </View>
          </View>
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
              disabled={inRequest}
              loading={inRequest}
              contentStyle={{}}
              onPress={handleCreateNewUserAfterLoginGoogle}
            >
              Xác nhận
            </Button>
          </View>
        </Modal>
      </Portal>
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
            onPress={() =>
              onGoogleButtonPress()
                .then(() => console.log("Signed in with Google successfully!"))
                .catch((e) => {
                  console.log("Failed to sign in with Google!", e);
                })
            }
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
        </View>
        <View className="items-center flex-row justify-between mt-4">
          <Text className="text-red-600">
            {loginErrorGoogleMessage || params.messageError}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
