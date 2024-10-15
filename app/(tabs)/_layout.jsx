import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { router, Tabs } from 'expo-router';
import { Bell, Heart, ReceiptText, ShoppingBag, Store } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import AnimatedTabBar from '../../components/common/TabBar2';
// const TabIcon = ({ icon, color, name, focused, iconName }) => {
//   return (
//     <View className="items-center justify-center ">
//       <IconButton
//         icon={iconName}
//         theme={{ colors: { secondary: "white" } }}
//         iconColor={focused ? "#e5ff00" : Colors.commonBtnText}
//         size={28}
//         onPress={(e) => {
//           router.push("/" + name);
//         }}
//       />
//     </View>
//   );
// };
const TabIcon = ({ icon, color, name, focused, iconName }) => {
  return (
    <TouchableRipple
      className="items-center justify-center h-full w-full  rounded-full"
      onPress={() => router.push('/' + name)}
      rippleColor="rgba(80, 80, 80, 0.075)"
      borderless={true}
    >
      <View className="">{iconName}</View>
    </TouchableRipple>
  );
};
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  activeBackground: {
    position: 'absolute',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  component: {
    height: 60,
    width: 60,
    marginTop: -5,
  },
  componentCircle: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 36,
    width: 36,
  },
});
const Tab = createBottomTabNavigator();
const TabLayout = () => {
  return (
    <>
      <Tabs
        backBehavior="history"
        initialRouteName="homes"
        animation=""
        tabBar={(props) => <AnimatedTabBar {...props} />}
        screenOptions={{
          animation: 'fade',
        }}
      >
        <Tabs.Screen
          name="home"
          screenOptions={{
            animation: 'flip',
          }}
          options={{
            title: 'Trang chủ',
            headerShown: false,
            tabBarIcon: ({ ref }) => <Store color={'white'} size={24} />,
          }}
        />
        <Tabs.Screen
          name="order"
          options={{
            title: 'Đơn hàng',
            headerShown: false,
            tabBarIcon: ({ ref }) => (
             <ReceiptText color={'white'} size={24} /> 
            ),
            
          }}
           
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Giỏ hàng',
            headerShown: false,
            tabBarIcon: ({ ref }) => (
            <ShoppingBag color={'white'} size={24} />
            ),
          }}
          backBehavior="history"
        />
        <Tabs.Screen
          name="notify"
          options={{
            title: 'Thông báo',
            headerShown: false,
            headerStyle: {

            },
            headerSearchBarOptions: {
              placeholder: "Search"
            },
            tabBarIcon: ({ ref }) => (
             <Bell color={'white'} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="like"
          options={{
            title: 'Yêu thích',
            headerShown: false,
            tabBarIcon: ({ ref }) => (
             <Heart color={'white'} size={24} />            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;
