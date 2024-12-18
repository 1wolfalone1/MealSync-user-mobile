import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Button,
  HelperText,
  IconButton,
  Surface,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { Rating } from "react-native-ratings";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import { Colors } from "../constant";
import images from "../constant/images";
import globalSlice from "../redux/slice/globalSlice";
import { orderHistorySliceSelector } from "../redux/slice/orderHistorySlice";
const ReviewForm = () => {
  const { orderId } = useLocalSearchParams();
  const { width, height } = Dimensions.get("window");
  const widthImage = (width * 50) / 100;
  const widthImage2 = (width * 25) / 100;
  const { orderReviewDetails } = useSelector(orderHistorySliceSelector);
  const [rating, setRating] = useState(4);
  const [commnent, setCommnent] = useState("");
  const [commnetError, setCommnetError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState([]);
  const [imageUrls, setImageUrls] = useState([{ firstIndex: true }]);
  const dispatch = useDispatch();
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
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      console.log(result);
      if (!result.cancelled) {
        const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
        if (!fileInfo.exists) {
          return;
        }
        if (fileInfo.size / (1024 * 1024) > 5) {
          Alert.alert(
            "Tệp không hợp lệ",
            "Tệp tải lên không được lớn hơn 5MB 😔"
          );
          return;
        }
        setImageUrls([
          { uri: result.assets[0].uri, firstIndex: false },
          ...imageUrls,
        ]);
      }
    } catch (e) {
      console.log(e, " error processing image");
    }
  };
  const handleReview = async () => {
    if (commnent == "") {
      setCommnetError("Bận cần nhập đánh giá cho shop");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Rating", rating);
      formData.append("Comment", commnent);
      formData.append("OrderId", orderId);
      if (imageUrls.length > 0) {
        imageUrls.forEach((i) => {
          if (!i.firstIndex) {
            formData.append("Images", {
              uri: i.uri,
              name: "image.jpg",
              type: "image/jpg",
            });
          }
        });
      }
      const res = await api.post("/api/v1/customer/order/review", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      const data = await res.data;
      if (data.isSuccess) {
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
            message: "Đánh giá đơn hàng thành công 🥳",
          })
        );
        router.push("/order/order-history");
      } else {
        setLoading(false);
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
            message: data?.error?.message,
          })
        );
      }
    } catch (e) {
      setLoading(false);
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
              message: "Có gì đó sai sai! Mong bạn thử lại sau 😅",
            })
          );
        }
      }
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingBottom: 20,
      }}
    >
      <ScrollView className="pb-10" contentContainerStyle={{}}>
        <View className="items-center justify-center">
          <Image
            source={{
              uri: orderReviewDetails?.logoUrl,
            }}
            style={{
              height: widthImage,
              width: widthImage,
              borderRadius: 100,
            }}
          />
          <Text className="font-bold text-xl my-4">
            {orderReviewDetails?.shopName}
          </Text>
        </View>
        <View>
          <Rating
            ratingCount={5}
            imageSize={50}
            jumpValue={1}
            startingValue={rating}
            onFinishRating={(value) => {
              setRating(value);
            }}
          />
        </View>
        <View className="px-10 my-4">
          <TextInput
            onChangeText={(value) => setCommnent(value)}
            value={commnent}
            mode="outlined"
            label="Đánh giá"
            multiline
            numberOfLines={4}
          />
          <HelperText type="error" visible={commnetError != ""}>
            {commnetError}
          </HelperText>
        </View>
        <View className="justify-center items-center">
          <View className="flex-row flex-wrap bg-transparent justify-between mx-6">
            <FlatList
              contentContainerStyle={{}}
              data={imageUrls}
              scrollEnabled={false}
              numColumns={3}
              renderItem={({ item, index }) => {
                if (item.firstIndex) {
                  return (
                    <View
                      style={{
                        borderRadius: 24,
                        width: widthImage2,
                        height: widthImage2,
                        margin: 10,
                        backgroundColor: "white",
                        ...styles.shadow,
                      }}
                    >
                      <TouchableRipple
                        borderless
                        style={{
                          borderRadius: 24,
                        }}
                        onPress={() => pickImage()}
                      >
                        <Image
                          source={images.AddImage}
                          style={{
                            height: widthImage2,
                            width: widthImage2,
                            borderRadius: 24,
                          }}
                        />
                      </TouchableRipple>
                    </View>
                  );
                } else {
                  return (
                    <Surface
                      elevation={1}
                      style={{
                        overflow: "hidden",
                        width: widthImage2,
                        height: widthImage2,
                        margin: 10,
                        borderRadius: 24,
                      }}
                    >
                      <View className="absolute top-2 right-2 z-[1] bg-red-500 rounded-full">
                        <IconButton
                          size={12}
                          iconColor="white"
                          onPress={() => {
                            setImageUrls(
                              imageUrls.filter((_, i) => i !== index)
                            );
                          }}
                          style={{
                            margin: 0,
                          }}
                          icon={"cancel"}
                        />
                      </View>

                      <Image
                        source={{ uri: item.uri }}
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                        }}
                      />
                    </Surface>
                  );
                }
              }}
            />
          </View>

          <Button
            onPress={handleReview}
            style={{
              marginTop: 30,
              marginBottom: 30,
            }}
            loading={loading}
            contentStyle={{
              backgroundColor: Colors.primaryBackgroundColor,
            }}
            mode="contained"
          >
            Đánh giá
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewForm;

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 2, height: 1 },
    shadowColor: Colors.shadow[100],

    shadowOpacity: 0.4,
    elevation: 2,
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
