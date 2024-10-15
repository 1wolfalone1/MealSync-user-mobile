import { Slot } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import api from '../../../api/api';
import CategoryItemInHome from '../../../components/user-page/CategoryItemInHome';
import DynamicHeader from '../../../components/user-page/HeaderAnimated';
import searchSlice from '../../../redux/slice/searchSlice';
const styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
    paddingBottom: 0,
  },
  scrollText: {
    fontSize: 19,
    textAlign: 'center',
    padding: 20,
    color: '#000',
  },
});
const blankData = [null, null, null, null, null];
const HomePage = () => {
  const [categories, setCategories] = useState(null);
  const [idCategorySelected, setCategorySelected] = useState(1);
  const dispatch = useDispatch()
  const handleGetCategories = async () => {
    try {
      const res = await api.get('api/v1/platform-category');
      const data = await res.data;
      setCategories(data.value);
      console.log(data.value, ' category');
    } catch (err) {
      console.log(err, ' error in DynamicHeader');
    }
  };
  const handleClickCategory = (id) => {
    if(id == idCategorySelected) {
      setCategorySelected(0)
      dispatch(searchSlice.actions.updateFilterInSearchProductInHome({
        categoryId: 0
      }))
    } else {
      setCategorySelected(id)
      dispatch(searchSlice.actions.updateFilterInSearchProductInHome({
        categoryId: id
      }))
    }
  }
  let scrollOffsetY = useRef(new Animated.Value(0)).current;
  useEffect(() => {

    handleGetCategories();
  }, []);
  return (
    <SafeAreaView style={styles.container} className="bg-white" edges={['top', 'right', 'left']}>
      <DynamicHeader animHeaderValue={scrollOffsetY} />
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
          useNativeDriver: false,
        })}
      >
        <View className="flex-1">
          <View className="flex-row mt-2">
            <FlatList
              contentContainerStyle={{ paddingLeft: 28, paddingVertical: 8 }}
              horizontal
              data={categories ? categories : blankData}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <CategoryItemInHome
                  item={item}
                  idCategorySelected={idCategorySelected}
                  setCategorySelected={handleClickCategory}
                />
              )}
            />
          </View>
        </View>
        <Slot screenOptions={{}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;
