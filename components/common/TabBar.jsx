import { router } from 'expo-router';
import { Bell, Heart, ReceiptText, ShoppingBag, Store } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TabBar = ({ state, descriptors, navigation }) => {
  const icons = {
    home: (props) => <Store name="storefront" size={20} color={'red'} />,
    cart: (props) => <ShoppingBag color={'red'} size={20} />,
    like: (props) => <Heart color={'red'} size={20} />,
    notify: (props) => <Bell color={'red'} size={20} />,
    order: (props) => <ReceiptText color={'red'} size={20} />,
  };

  const primaryColor = '#0891b2';
  const greyColor = '#737373';
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          router.push(route.name, route.params);
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabbarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {icons[route.name]({
              color: isFocused ? primaryColor : greyColor,
            })}
            <Text
              style={{
                color: isFocused ? primaryColor : greyColor,
                fontSize: 10,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fffffff8',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fc505084',
    borderCurve: 'continuous',
    shadowColor: '#ff0000',
    shadowOffset: { width: 4, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});

export default TabBar;
