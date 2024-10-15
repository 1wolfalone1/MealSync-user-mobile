import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Dimensions, Image, Platform, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors, Images } from '../../constant';
const ImageChangeInUpgradeToShop = ({ logo, setLogo, banner, setBanner }) => {
  const { width, height } = Dimensions.get('window');
  const widthBanner = (width * 90) / 100;
  const heightBanner = (width * 50) / 100;
  const widthLogo = (width * 30) / 100;
  const pickImage = async (setImage, aspect) => {
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
      aspect: aspect,
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <View className="mb-10">
      <View className="items-center">
        <Image
          style={{
            width: widthBanner,
            height: heightBanner,
            borderRadius: 20,
            marginBottom: 10,
          }}
          source={
            banner
              ? {
                  uri: banner,
                }
              : Images.NoImage
          }
        />
        <IconButton
          mode="contained-tonal"
          className="absolute right-[50] bottom-[-10] "
          onPress={() => {
            if (banner) {
              setBanner(null);
            } else {
              pickImage(setBanner, [9, 6]);
            }
          }}
          iconColor={Colors.primaryBackgroundColor}
          icon={!banner ? 'camera' : 'cancel'}
        />
      </View>
      <View className="absolute left-10 bottom-[-30]">
        <Image
          style={{
            borderRadius: 1000,
            width: widthLogo,
            height: widthLogo,
            borderWidth: 1,
            borderColor: Colors.primaryBackgroundColor,
          }}
          source={
            logo
              ? {
                  uri: logo,
                }
              : Images.NoImage
          }
        />
        <IconButton
          mode="contained-tonal"
          className="absolute right-[-10] bottom-[-10] "
          onPress={() => {
            if (logo) {
              setLogo(null);
            } else {
              pickImage(setLogo, [4, 4]);
            }
          }}
          iconColor={Colors.primaryBackgroundColor}
          icon={!logo ? 'camera' : 'cancel'}
        />
      </View>
    </View>
  );
};

export default ImageChangeInUpgradeToShop;
