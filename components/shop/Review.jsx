import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';

const listReviewers = [
  {
    name: 'Huỳnh Văn Phướt',
    avatarUrl:
      'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
    star: 4.5,
    date: '2024-05-23',
    content:
      'Thức ăn ngon, giao hàng nhanh, chủ shop siêu thân thiện, ngày nào cũng dặt luôn, menu đa dạng nên ăn mỗi ngày một món !!!',
  },
  {
    name: 'Cao Nhật Thiên',
    avatarUrl:
      'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
    star: 4.5,
    date: '2024-05-23',
    content:
      'Valentine buồn :((( nhưng mà may mắn vì có đồ ăn của shop, chị gái nhân viên giao hàng shop cũng xình, nhưng vì cô đơn và chị gái giao hàng quả phũ phàng nên chỉ cho 4.5 sao. Cơ mà đồ ăn ngon, đóng gói đẹp, tuyệt vời cho một valentine lonely :(((',
  },
  {
    name: 'Kim Ngọc',
    avatarUrl:
      'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
    star: 4,
    date: '2024-05-23',
    content:
      ':vvvvv biết là Tết, shop đồng, giao hàng trẻ thì không nói, đằng này tôi đặt cả phê, shop lại giao trà tắc?? nó chênh nhau tới 10k lận đó :vvv',
  },
  {
    name: 'Duy Đức',
    avatarUrl:
      'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
    star: 5,
    date: '2024-05-23',
    content: 'Chỉ biết nhận xét một từ! "Ngon". Lần sau sẽ ủng hộ VFoody.',
  },
  {
    name: 'Kim Ngọc',
    avatarUrl:
      'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
    star: 4,
    date: '2024-05-23',
    content:
      ':vvvvv biết là Tết, shop đồng, giao hàng trẻ thì không nói, đằng này tôi đặt cả phê, shop lại giao trà tắc?? nó chênh nhau tới 10k lận đó :vvv',
  },
  {
    name: 'Duy Đức',
    avatarUrl:
      'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
    star: 5,
    date: '2024-05-23',
    content: 'Chỉ biết nhận xét một từ! "Ngon". Lần sau sẽ ủng hộ VFoody.',
  },
  {
    name: 'Văn Thống',
    avatarUrl:
      'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
    star: 4,
    date: '2024-05-23',
    content:
      ':vvvvv biết là Tết, shop đồng, giao hàng trẻ thì không nói, đằng này tôi đặt cả phê, shop lại giao trà tắc?? nó chênh nhau tới 10k lận đó :vvv',
  },
  {
    name: 'Hoàng Tiến',
    avatarUrl:
      'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
    star: 5,
    date: '2024-05-23',
    content: 'Chỉ biết nhận xét một từ! "Ngon". Lần sau sẽ tiếp tục ủng hộ VFoody.',
  },
];

const Item = ({ name, avatarUrl, star, date, content }) => (
  <View className="px-5 py-2">
    <View className="flex flex-row gap-4">
      <View className="">
        <Image source={{ uri: `${avatarUrl}` }} className="w-20 h-20 rounded-full" />
        <Text className="position: absolute text-sm p-1 bg-orange-400 text-white rounded-full right-0 bottom-0">
          {star.toFixed(1)}
        </Text>
      </View>
      <View className="flex justify-center">
        <Text className="text-xl">{name}</Text>
        <Text className="text-sm text-gray-400">{date}</Text>
      </View>
    </View>
    <Text className=" text-lg text-gray-500">{content}</Text>
  </View>
);

export default function ReviewList() {
  const reviewer = ({ item }) => (
    <Item
      name={item.name}
      avatarUrl={item.avatarUrl}
      star={item.star}
      date={item.date}
      content={item.content}
    />
  );

  return <FlatList data={listReviewers} keyExtractor={(item) => item.id} renderItem={reviewer} />;
}
