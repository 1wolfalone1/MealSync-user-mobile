import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { Button, HelperText, TextInput, TouchableRipple } from 'react-native-paper';
import { Rating } from 'react-native-ratings';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';
import { Colors } from '../constant';
import globalSlice from '../redux/slice/globalSlice';
import { orderHistorySliceSelector } from '../redux/slice/orderHistorySlice';
const ReviewForm = () => {
  const { orderId } = useLocalSearchParams();
  const { width, height } = Dimensions.get('window');
  const widthImage = (width * 50) / 100;
  const widthImage2 = (width * 30) / 100;
  const { orderReviewDetails } = useSelector(orderHistorySliceSelector);
  const [rating, setRating] = useState(4);
  const [commnent, setCommnent] = useState('');
  const [commnetError, setCommnetError] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const pickImage = async () => {
    console.log(' -----------------pick image----------------');
    if (Platform.OS !== 'web') {
      const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (libraryStatus.status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }

      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
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
      setImage(result.assets[0].uri);
    }
  };
  const handleReview = async () => {
    if (commnent == '') {
      setCommnetError('Bận cần nhập đánh giá cho shop');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('Rating', rating);
      formData.append('Comment', commnent);
      formData.append('OrderId', orderId);
      if (image) {
        formData.append('Images', {
          uri: image,
          type: 'image/*',
          name: 'image',
        });
      }
      const res = await api.post('/api/v1/customer/order/review', formData, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      });
      const data = await res.data;
      if (data.isSuccess) {
        dispatch(
          globalSlice.actions.customSnackBar({
            style: {
              color: 'white',
              backgroundColor: Colors.glass.green,
              pos: {
                top: 40,
              },
              actionColor: 'yellow',
            },
          }),
        );
        dispatch(
          globalSlice.actions.openSnackBar({ message: 'Đánh giá đơn hàng thành công' }),
        );
        router.push('/order/order-history');
      } else {
        setLoading(false);
          dispatch(
          globalSlice.actions.customSnackBar({
            style: {
              color: 'white',
              backgroundColor: Colors.glass.red,
              pos: {
                top: 40,
              },
              actionColor: 'yellow',
            },
          }),
        );
        dispatch(
          globalSlice.actions.openSnackBar({
            message:
              data?.error?.message,
          }),
        );

      }
    } catch (e) {
      setLoading(false);
       dispatch(
        globalSlice.actions.customSnackBar({
          style: {
            color: 'white',
            backgroundColor: Colors.glass.red,
            pos: {
              top: 40,
            },
            actionColor: 'red',
          },
        }),
      );
      dispatch(
        globalSlice.actions.openSnackBar({
          message: 'Đã có lỗi xảy ra ở máy chủ :_)'
        }),
      );
      console.log('Review failed: ', e);
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
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
        <Text className="font-bold text-xl my-4">{orderReviewDetails?.shopName}</Text>
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
        <HelperText type="error" visible={commnetError != ''}>
          {commnetError}
        </HelperText>
      </View>
      <View className="justify-center items-center">
        <View
          style={{
            borderRadius: 24,

            backgroundColor: 'white',
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
              source={{
                uri: image
                  ? image
                  : 'https://www.its.ac.id/tmesin/wp-content/uploads/sites/22/2022/07/no-image.png',
              }}
              style={{
                height: widthImage2,
                width: widthImage2,
                borderRadius: 24,
              }}
            />
          </TouchableRipple>
        </View>
        <Button
          onPress={handleReview}
          style={{
            marginTop: 30,
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
    </SafeAreaView>
  );
};

export default ReviewForm;

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[100],

    shadowOpacity: 0.4,
    elevation: 10,
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
