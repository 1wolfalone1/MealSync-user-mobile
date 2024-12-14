import { useIsFocused } from "@react-navigation/native";
import qs from "qs";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import PreviewCardChat from "../../components/chat/PreviewCardChat";
import globalSlice, { globalSelector } from "../../redux/slice/globalSlice";
const emptyList = Array(5).fill(null);
const ListChatChannelPage = () => {
  const { socket } = useSelector(globalSelector);
  const isFocus = useIsFocused();
  const [listChannel, setListChannel] = useState(null);
  const [listChannelSocket, setListChannelSocket] = useState(null);
  const [listChannelMerge, setListChannelMerge] = useState(null);
  const [pageState, setPageState] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const listRef = useRef(null);
  const hasNext2 = useRef(false);
  useEffect(() => {
    if (socket) {
      socket.emit("regisListChannel", {
        pageState: null,
        pageSize: 10,
      });
    }
  }, [isFocus]);
  useEffect(() => {
    if (socket) {
      socket.on("getListChannel", (msg) => {
        setOnRequest(true);
        console.log(msg, " messssage neeeeeeeeeeeeeeeeeeeeeeeee");
        setHasNext(false);
        if (msg) {
          hasNext2.current = msg.hasNext;
        }
        if (msg && msg.data && Array.isArray(msg.data) && msg.data.length > 0) {
          const listRoomIds = msg.data.map((i) => i.id);
          setListChannelSocket(msg.data);
          handleGetListChannelInfo(listRoomIds);
          setPageState(msg.pageState);
          console.log(msg, " message received");
        } else {
          setHasNext(hasNext2.current);
        }
      });
      socket.on("getNewMessage", async (msg) => {
        if (msg) {
          console.log(msg, " sssssssssssssssssssssssssssssssss");
          await handleGetNewMessage(msg);
        }
      });
    }
  }, []);
  useEffect(() => {
    if (newMessage) {
    }
  }, [newMessage]);
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
      setHasNext(hasNext2.current);
      console.log(hasNext2, " hasnexssssssssssssssssssssssssssssst s", hasNext);
      const data = await res.data;
      console.log(data, " get list channel info");
      setListChannel(data.value);
    } catch (e) {
      setOnRequest(false);
      console.log("Get list all chat channel error: ", e);
    }
  };

  const handleGetNewMessage = async (msg) => {
    try {
      const res = await api.get("/api/v1/order/chat-info", {
        params: {
          ids: [msg.id],
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      });

      const data = await res.data;
      if (
        data.isSuccess &&
        data.value &&
        Array.isArray(data.value) &&
        data.value.length > 0
      ) {
        const newMergeData = {
          info: data.value[0][`${msg.last_update_id}`],
          ...msg,
        };

        if (listRef.current && Array.isArray(listRef.current)) {
          const newListMergeData = listRef.current.filter(
            (i) => i.id != msg.id
          );
          const newList = [newMergeData, ...newListMergeData];

          setListChannelMerge(newList);
          listRef.current = newList;
        }
      }
    } catch (e) {
      console.log("Get list all chat channel error: ", e);
    }
  };
  const dispatch = useDispatch();
  useEffect(() => {
    if (socket) {
      socket.emit("regisListChannel", {
        pageState: null,
        pageSize: 10,
      });
    }
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
      console.log(listChannel, mapChannelSocket);
      let listChannelMergeInfo = listChannel.map((item, index) => {
        return {
          ...mapChannelSocket[item.id],
          info: item[mapChannelSocket[item.id].last_update_id],
        };
      });

      console.log(listChannelMergeInfo, " listChannelMergeInfo");
      if (listChannelMerge && Array.isArray(listChannelMerge)) {
        const existingIds = new Set(
          listChannelMergeInfo.map((item) => item.id)
        ); // Get IDs from the existing list
        const filteredListChannelMerge = listChannelMerge.filter(
          (item) => !existingIds.has(item.id)
        ); // Exclude duplicates

        listChannelMergeInfo = [
          ...listChannelMergeInfo,
          ...filteredListChannelMerge,
        ]; // Merge the arrays
      }
      listChannelMergeInfo.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
      setListChannelMerge(listChannelMergeInfo);
      listRef.current = listChannelMergeInfo;
      setOnRequest(false);
    }
  }, [listChannel]);
  return (
    <SafeAreaView
      edges={["bottom"]}
      className="flex-1"
      style={{
        backgroundColor: "#fffafa",
      }}
    >
      <View>
        {listChannelMerge && (
          <FlatList
            data={listChannelMerge ? listChannelMerge : emptyList}
            contentContainerStyle={{
              alignItems: "center",
              marginTop: 20,
              paddingBottom: 40,
            }}
            ListFooterComponent={() => {
              return (
                <>
                  {hasNext && (
                    <View className="items-center mb-100">
                      <Button
                        loading={onRequest}
                        disabled={onRequest}
                        onPress={() => {
                          socket.emit("regisListChannel", {
                            pageState: pageState,
                            pageSize: 10,
                          });
                        }}
                        mode="text"
                      >
                        Thêm lịch sử tin nhắn
                      </Button>
                    </View>
                  )}
                </>
              );
            }}
            keyExtractor={(item) => {
              return `${item.id}`;
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
        )}
      </View>
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
