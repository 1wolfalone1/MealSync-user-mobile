import { useIsFocused } from "@react-navigation/native";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import PreviewCardChat from "../../components/chat/PreviewCardChat";
import globalSlice, { globalSelector } from "../../redux/slice/globalSlice";
const emptyList = Array(5).fill(null);
const ListChatChannelPage = () => {
  const { socket } = useSelector(globalSelector);
  const isFocus = useIsFocused();
  const handleGetListChannelInfo = async (listRoomIds) => {
    try {
      const res = await api.get("/api/v1/order/chat-info", {
        params: {
          ids: listRoomIds,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      });
      const data = await res.data;
      console.log(data, " get list channel info");
      setListChannel(data.value);
    } catch (e) {
      console.log("Get list all chat channel error: ", e);
    }
  };
  const [listChannel, setListChannel] = useState(null);
  const [listChannelSocket, setListChannelSocket] = useState(null);
  const [listChannelMerge, setListChannelMerge] = useState(null);
  useEffect(() => {
    if (socket) {
      socket.on("getListChannel", (msg) => {
        console.log(msg);
        const listRoomIds = msg.map((i) => i.id);
        setListChannelSocket(msg);
        handleGetListChannelInfo(listRoomIds);
      });
    }
  }, []);
  const dispatch = useDispatch()
  useEffect(() => {
    socket.emit("regisListChannel", true);
    dispatch(globalSlice.actions.setCurrentScreen("chatList"));
    return () => {
      dispatch(globalSlice.actions.setCurrentScreen(""));
    };
  }, [isFocus]);
  useEffect(() => {
    if (listChannel) {
      const mapChannelSocket = listChannelSocket.reduce((acc, channel) => {
        acc[channel.id] = channel;
        return acc;
      }, {});
      const listChannelMergeInfo = listChannel.map((item, index) => {
        return { ...mapChannelSocket[item.id], info: item.customer };
      });
      listChannelMergeInfo.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
      setListChannelMerge(listChannelMergeInfo);
    }
  }, [listChannel]);
  return (
    <SafeAreaView edges={["bottom"]} className="">
      <FlatList
        data={listChannelMerge ? listChannelMerge : emptyList}
        contentContainerStyle={{
          alignItems: "center",
          marginTop: 20,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => <PreviewCardChat item={item} />}
        ItemSeparatorComponent={() => (
          <Divider
            style={{
              height: 0,
              marginVertical: 10,
              backgroundColor: "#b1b1b1",
            }}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ListChatChannelPage;

const listShop = [
  {
    id: 3,
    shopName: "Shop",
    text: "This is test chate",
    logoUrl:
      "https://repository-images.githubusercontent.com/366884555/c2d2e700-b396-11eb-871e-2faafc8e4d07",
    channelId: "1",
  },
  {
    id: 4,
    shopName: "Shop",
    text: "This is test chate",
    logoUrl:
      "https://repository-images.githubusercontent.com/366884555/c2d2e700-b396-11eb-871e-2faafc8e4d07",
    channelId: "1",
  },
];
