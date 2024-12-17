import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FAB, Portal } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../constant";
import { cartSelector } from "../../redux/slice/cartSlice";
import globalSlice, { globalSelector } from "../../redux/slice/globalSlice";
import { dataShopDetailsSelector } from "../../redux/slice/shopDetailsSlice";
import { convertIntTimeToString } from "../../utils/MyUtils";
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[400],

    shadowOpacity: 0.1,
    elevation: 4,
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
const FloatCartButton = () => {
  const [state, setState] = React.useState({ open: false });
  const { openFabInShop } = useSelector(globalSelector);
  const onStateChange = ({ open }) => {
    setState({ open });
  };

  const { open } = state;

  const { items } = useSelector(cartSelector);

  const data = useSelector(cartSelector);
  const { info } = useSelector(dataShopDetailsSelector);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [operatingSlots, setOperatingSlots] = useState([]);
  const [cartTitle, setCartTitle] = useState(null);
  const dispatch = useDispatch();
  const { notInShop } = useSelector(globalSelector);

  useEffect(() => {
    setCartQuantity(items[info?.id]?.length);
    if (items[info?.id] && Array.isArray(items[info?.id])) {
      setCartTitle(
        items[info?.id]?.length === 0
          ? null
          : items[info?.id].length + " sản phẩm  "
      );
    } else {
      setCartTitle(null);
    }
  }, [items, info]);
  useEffect(() => {
    if (info && info.operatingSlots && Array.isArray(info.operatingSlots)) {
      const newOperatingSlots = info.operatingSlots.map((item) => {
        let count = 0;
        if (items && Array.isArray(items[info?.id])) {
          const filterList = items[info?.id].filter(
            (i) => i.operatingSlotId == item.id
          );

          if (filterList && Array.isArray(filterList)) {
            count = filterList.length;
          }
        }
        return {
          icon: "timer-outline",
          label: `${item.title} từ ${convertIntTimeToString(item.startTime)} đến ${convertIntTimeToString(item.endTime)} (${count})`,
          onPress: () => {
            router.push({
              pathname: "/shop/temp-cart",
              params: {
                shopId: info.id,
                operatingSlotId: item.id,
              },
            });
          },
        };
      });
      setOperatingSlots(newOperatingSlots);
    }
  }, [info, items]);
  useEffect(() => {
    return () => {};
  }, []);
  const handleOpenTempCart = () => {
    if (items[info?.id]) {
      router.push("/shop/temp-cart");
    } else {
      dispatch(
        globalSlice.actions.customSnackBar({
          style: {
            color: "white",
            backgroundColor: Colors.glass[100],
            pos: {
              top: 40,
            },
            actionColor: "yellow",
          },
        })
      );
      dispatch(
        globalSlice.actions.openSnackBar({
          message: "Không có sản phẩm nào trong giỏ hàng",
        })
      );
    }
  };
  const a = "test";

  return notInShop ? (
    <></>
  ) : (
    <Portal>
      <FAB.Group
        key={"asdfasfd"}
        open={open}
        visible={openFabInShop}
        label={cartTitle}
        testID="dsf"
        fabStyle={{}}
        style={{}}
        icon={open ? "cart-outline" : "cart-outline"}
        actions={operatingSlots}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // handleOpenTempCart();
            // do something if the speed dial is open
          }
        }}
      />
    </Portal>
  );
};

export default FloatCartButton;
