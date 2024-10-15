import { router } from 'expo-router';
import React from 'react';
import { TextInput, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors } from '../../constant';

const SearchInputAnimated = () => {
  const [focus, setFocus] = React.useState(false);
  return (
    <View
      className="ml-7  flex-row justify-start items-center border-solid border-3 rounded-xl "
      style={{
        borderWidth: 1,
        borderColor: focus? Colors.primaryBackgroundColor : "#c2c2c2",
        backgroundColor: "#c2c2c2",
        width: 100
      }}
    >
      <IconButton
        icon="magnify"
        iconColor={Colors.primaryBackgroundColor}
        onPress={() => router.push('/home/search-list')}
      />
      <TextInput
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        className="flex-1 font-hnow63book"
        style={{
          width: 0
        }}
        placeholder="Tìm kiếm món ăn hay shop house?"
      />
    </View>
  );
};

export default SearchInputAnimated;
