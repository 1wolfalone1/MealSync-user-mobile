import React from 'react'
import { Dimensions, Image, View } from 'react-native'
import images from '../../constant/images'

const WaitingUpgradeShop = () => {
  const {width, height} = Dimensions.get('window')
  const widthImage = width * 90 /100;
  return (
    <View className="bg-white flex-1 items-center justify-center">
      <Image
        source={images.WaitingAccept} 
        style={{
          width: widthImage,
          height: widthImage
        }}
      />
    </View>
  )
}

export default WaitingUpgradeShop