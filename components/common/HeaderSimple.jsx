import { router } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { Colors } from '../../constant'

const HeaderSimple = ({title}) => {
  return (
    <View className="flex-row justify-center items-cent py-5 ">
        <IconButton
          icon="chevron-left"
          iconColor={Colors.primaryBackgroundColor}
          size={60}
          theme={{ padding: 5 }}
          onPress={() => router.back()}
          className="p-0 m-0 absolute left-1"
          style={{ borderRadius: 16 , alignSelf: 'center'}}
        />
      <Text className="font-hnow65medium text-xl text-black">{title}</Text>
    </View>
  )
}

export default HeaderSimple