import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";
import { useDispatch } from "react-redux";
import api from "../../../api/api";
import ItemInPageNotify from "../../../components/notify/ItemInPageNotify";
import usePagination from "../../../custom-hook/usePagination";
import usePullToRefresh from "../../../custom-hook/usePullToRefresh";
import globalSlice from "../../../redux/slice/globalSlice";

const emptyList = new Array(4).fill(null);
const NotifyIndex = () => {
  const [data2, setData] = useState(null);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const { refreshing, onRefreshHandler } = usePullToRefresh({
    onRefreshFunction() {
      setCurrentPage(1);
      getNoti(1, 12);
    },
  });
  const { currentPage, handleEndReached, setCurrentPage } = usePagination({
    fetchFunction: () => {
      console.log(" asfdasd" + currentPage);
      getNoti(currentPage + 1, 12);
    },
    setLoading: setLoading,
    totalPages: total,
    initialPage: 1,
  });
  console.log(total, " totalPages");
  const getNoti = async (pageIndex, pageSize) => {
    try {
      if (data2 == null) {
        dispatch(
          globalSlice.actions.changeLoadings({
            isLoading: true,
            msg: "Đang tải dữ liệu...",
          })
        );
      }
      const res = await api.get(
        "/api/v1/customer/notification" +
          "?pageIndex=" +
          pageIndex +
          "&pageSize=" +
          pageSize
      );
      const data = await res.data;
      if (data.isSuccess) {
        setTotal(data.value.totalPages);
        if (pageIndex == 1) {
          setData(data.value.items);
        } else {
          console.log(data.value.items, data2, " itemmmmmmm");
          setData([...data2, ...data.value.items]);
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.status == 400) {
          dispatch(
            globalSlice.actions.customSnackBar({
              style: {
                color: "white",
                backgroundColor: "red",
                pos: {
                  top: 40,
                },
                actionColor: "white",
              },
            })
          );
          dispatch(
            globalSlice.actions.openSnackBar({
              message: e.response?.data?.error?.message + "😠",
            })
          );
        } else {
          dispatch(
            globalSlice.actions.customSnackBar({
              style: {
                color: "white",
                backgroundColor: Colors.glass.red,
                pos: {
                  top: 40,
                },
                actionColor: "white",
              },
            })
          );
          dispatch(
            globalSlice.actions.openSnackBar({
              message: "Có gì đó sai sai! Mong bạn thử lại sau 😅",
            })
          );
        }
      }
      console.log(e);
    } finally {
      dispatch(
        globalSlice.actions.changeLoadings({
          isLoading: false,
          msg: "Đang tải dữ liệu...",
        })
      );
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    getNoti(1, 12);
  }, [isFocus]);
  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={data2 ? data2 : emptyList}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        renderItem={({ item }) => <ItemInPageNotify item={item} />}
        ItemSeparatorComponent={() => (
          <Divider
            style={{
              width: "100%",
              height: 2,
              backgroundColor: "#dfdfdf",
            }}
          />
        )}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="small" className="mt-4" /> : null
        }
        scrollEventThrottle={60}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshHandler}
          />
        }
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default NotifyIndex;

const data = [
  {
    id: 1,
    title: "Shop noti",
    body: "Bạn đã nhận được 1 đơn hàng mới",
    image:
      "https://pbs.twimg.com/profile_images/554798224154701824/mWd3laxO_400x400.png",
    createAt: "now",
  },
  {
    id: 2,
    title: "Shop noti",
    body: "Bạn đã nhận được 1 đơn hàng mới",
    image: "https://pbs.twimg.com/media/EXrLZdWWoAE8HkE.png",
    createAt: "19:03",
  },
  {
    id: 3,
    title: "Shop noti",
    body: "Bạn đã nhận được 1 đơn hàng mới",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcrvFbkVZKVkQUXmQsWKnPtWYYZCGEuAbCjw&s",
    createAt: "23/06/2024 19:03",
  },
  {
    id: 4,
    title: "Shop noti",
    body: "Bạn đã nhận được 1 đơn hàng mới",
    image:
      "https://www.pngitem.com/pimgs/m/424-4242818_golang-logo-golang-gopher-hd-png-download.png",
    createAt: "20/06/2024 2:32",
  },
  {
    id: 5,
    title: "Shop noti",
    body: "Bạn đã nhận được 1 đơn hàng mới",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDHqzEv4reHgi8FXD6sZsDjoPbxqFUjOSe6b3xnP_USkrEmLdcVmL_afCjI8knHl8OtJ0&usqp=CAU",
    createAt: "19/06/2024 2:19",
  },
  {
    id: 6,
    title: "Shop noti asdf",
    body: "Bạn đã nhận được 1 đơn hàng mới",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDHqzEv4reHgi8FXD6sZsDjoPbxqFUjOSe6b3xnP_USkrEmLdcVmL_afCjI8knHl8OtJ0&usqp=CAU",
    createAt: "20/06/2024 2:32",
  },
  {
    id: 7,
    title: "Shop noti",
    body: "Bạn đã nhận được 1 đơn hàng mới",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDHqzEv4reHgi8FXD6sZsDjoPbxqFUjOSe6b3xnP_USkrEmLdcVmL_afCjI8knHl8OtJ0&usqp=CAU",
    createAt: "20/06/2024 2:32",
  },

  {
    id: 8,
    title: "Shop noti",
    body: "Bạn đã nhận được 1 đơn hàng mới",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDHqzEv4reHgi8FXD6sZsDjoPbxqFUjOSe6b3xnP_USkrEmLdcVmL_afCjI8knHl8OtJ0&usqp=CAU",
    createAt: "20/06/2024 2:32",
  },
];
