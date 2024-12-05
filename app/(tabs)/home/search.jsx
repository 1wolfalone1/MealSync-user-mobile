import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { Chip } from 'react-native-paper';
import api from '../../../api/api';
import ItemInGridSearch from '../../../components/user-page/ItemInGridSearch';
import { Colors } from '../../../constant';

const SearchPage = () => {
  const [dataPromtProduct, setDataPromtProduct] = useState(null);
  const handleGetDataPromtProduct = async () => {
    try {
      const res = await api.get('/api/v1/food/top?pageIndex=1&pageSize=20');
      const data = await res.data;
      console.log(data, ' data ItemSearch');
      setDataPromtProduct(data.value.items);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    handleGetDataPromtProduct();
  }, []);
  const blankList = Array(12).fill(null);
  return (
    <View className="mt-6">
      <ScrollView className="overflow-visible">
        <View className="flex-1 mb-8">
          <View className="mb-8 pl-7">
            <Text className="font-hnow65medium text-lg">Tìm kiếm gần đây</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="">
            <View className="flex-row gap-2 pl-7">
              {dataRecentSearch.map((item, index) => (
                <View
                  key={item.id}
                  className="bg-gray-200 p-1 min-w-[50] justify-center items-center rounded-2xl"
                >
                  <Text className="font-font-hnow63book text-gray-500 text-sm">{item.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        <View className="flex-1 mb-8 overflow-visible">
          <View className="mb-3 ml-7 mb-8">
            <Text className="font-hnow65medium text-lg">Tìm kiếm nổi bật</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="">
            <View className="flex-row justify-start  ml-7 ">
              {dataRecentSearch.map((item, index) => (
                <Chip
                  key={item.id}
                  style={{
                    marginRight: 8,
                    backgroundColor: Colors.primaryBackgroundColor,
                  }}
                  textStyle={{
                    fontSize: 12,
                    fontFamily: 'HeadingNow-63Book',
                    color: Colors.commonBtnText,
                    fontWeight: '600',
                  }}
                  onPress={() => console.log('Pressed')}
                >
                  {item.name}
                </Chip>
              ))}
            </View>
          </ScrollView>
        </View>
        <View className="mb-3 ml-7 mb-8">
          <Text className="font-hnow65medium text-lg">Được đề xuất</Text>
        </View>
        <View className="flex-row flex-wrap bg-transparent">
          <FlatList
            contentContainerStyle={{ paddingLeft: 28 }}
            data={dataPromtProduct ? dataPromtProduct : blankList}
            scrollEnabled={false}
            numColumns={3}
            renderItem={({ item }) => <ItemInGridSearch item={item} />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchPage;
dataRecentSearch = [
  {
    id: 1,
    name: 'Buger',
  },
  {
    id: 2,
    name: 'Pizza',
  },
  {
    id: 3,
    name: 'Cơm',
  },
  {
    id: 4,
    name: 'Bánh',
  },
  {
    id: 5,
    name: 'Chảo',
  },
  {
    id: 6,
    name: 'Mì',
  },
];

dataBestSearch = [
  {
    id: 1,
    name: 'Buger',
  },
  {
    id: 2,
    name: 'Beef',
  },
  {
    id: 3,
    name: 'Pizza',
  },
  {
    id: 4,
    name: 'Cơm',
  },
];

const dataShop = [
  {
    id: 1,
    name: 'The Green Leaf',
    shop: 'Green Leaf Tea Emporium',
    avatar_link:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU',
    background_link:
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg',
  },
  {
    id: 2,
    name: 'Crafted Elegance',
    shop: 'Elegant Crafts & Creations',
    avatar_link:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU',
    background_link:
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg',
  },
  {
    id: 3,
    name: 'Vintage Finds',
    shop: 'Retro Relics Boutique',
    avatar_link:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU',
    background_link:
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg',
  },
  {
    id: 4,
    name: 'Aromatic Delights',
    shop: 'Scented Candles Co.',
    avatar_link:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU',
    background_link:
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg',
  },
  {
    id: 5,
    name: 'Tech Haven',
    shop: 'Gadgets Galore',
    avatar_link:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU',
    background_link:
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg',
  },
  {
    id: 6,
    name: "Baker's Delight",
    shop: 'Sweet Treats Bakery',
    avatar_link:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU',
    background_link:
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg',
  },
  {
    id: 7,
    name: 'Outdoor Escapes',
    shop: 'Wilderness Outfitters',
    avatar_link:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU',
    background_link:
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg',
  },
  {
    id: 8,
    name: 'Fashion Haven',
    shop: 'Trendy Threads Boutique',
    avatar_link:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU',
    background_link:
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg',
  },
  {
    id: 9,
    name: 'Gourmet Cuisine',
    shop: 'Epicurean Eats',
    avatar_link:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU',
    background_link:
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg',
  },
  {
    id: 10,
    name: 'Pet Paradise',
    shop: 'Furry Friends Pet Store',
    avatar_link:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8olcOpPIZayKH74StFEmfIj3Zbtk-Bj24y2reURa269H_HYZuV2Nt8VoKIWmwWsyBuHA&usqp=CAU',
    background_link: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl',
  },
];
