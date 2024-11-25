import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import { Colors } from "../../constant";
import commonConstants from "../../constant/common";
import { loadInfo, userInfoSliceSelector } from "../../redux/slice/userSlice";
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[400],

    shadowOpacity: 0.4,
    elevation: 20,
    // background color must be set
  },
  shadowSelected: {
    shadowOffset: { width: 8, height: 8 },
    shadowColor: Colors.shadow.DEFAULT,

    shadowOpacity: 0.6,

    elevation: 20,
    // background color must be set
  },
});
const AvatarChange = ({}) => {
  const dispatch = useDispatch();
  const info = useSelector(userInfoSliceSelector);
  const [isChangeMode, setIsChangeMode] = useState(false);
  const [avatar, setAvatar] = useState(commonConstants.url.avatar);
  useEffect(() => {
    if (info) {
      setAvatar(info.avatarUrl);
    }
    (async () => {})();
  }, [info]);

  const pickImage = async () => {
    console.log(" -----------------pick image----------------");
    if (Platform.OS !== "web") {
      const libraryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (libraryStatus.status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }

      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setAvatar(result.assets[0].uri);
    }
  };
  const handleSaveAvatar = async () => {
    console.log(" -----------------save avatar----------------");
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: avatar,
        type: "image/jpg",
        name: "image.jpg",
      });
      const res = await api.put("/api/v1/customer/avatar", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      const data = await res.data;
      dispatch(loadInfo());
      console.log(data, "data upload image");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View className="justify-start items-center mt-8">
      <View
        style={{
          ...styles.shadow,
          backgroundColor: "white",
          borderRadius: 100,
        }}
      >
        <Avatar.Image
          size={180}
          source={{
            uri: avatar,
          }}
        />
        <IconButton
          mode="contained-tonal"
          className="absolute right-[-10] bottom-[-10] "
          onPress={pickImage}
          icon={"camera"}
          iconColor={Colors.primaryBackgroundColor}
          disabled={!isChangeMode}
        />
      </View>
      <Text className="font-hnow64regular text-2xl mt-8">
        {info?.fullname ? info.fullname : "Khách hàng"}
      </Text>
      {isChangeMode ? (
        <>
          <View className="flex-row gap-2 mt-2">
            <Button
              labelStyle={{
                fontSize: 18,
                color: "blue",
                fontFamily: "HeadingNow-63Book",
              }}
              mode="outlined"
              onPress={() => {
                setAvatar(info.avatarUrl);
                setIsChangeMode(!isChangeMode);
              }}
            >
              Hủy
            </Button>
            <Button
              mode="contained-tonal"
              labelStyle={{
                fontSize: 18,
                color: "blue",
                fontFamily: "HeadingNow-63Book",
              }}
              onPress={() => {
                console.log("asdfasf");
                handleSaveAvatar();
                setIsChangeMode(!isChangeMode);
              }}
            >
              Lưu ảnh
            </Button>
          </View>
        </>
      ) : (
        <Button
          labelStyle={{
            fontSize: 18,
            color: isChangeMode ? "blue" : "grey",
            fontFamily: "HeadingNow-63Book",
          }}
          onPress={() => setIsChangeMode(!isChangeMode)}
        >
          Chỉnh sửa
        </Button>
      )}
    </View>
  );
};

export default AvatarChange;
