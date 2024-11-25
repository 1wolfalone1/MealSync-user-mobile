import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GiftedChat, InputToolbar, Send as SendMess } from "react-native-gifted-chat";
import { Avatar, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Send } from "lucide-react-native";
import auth from "@react-native-firebase/auth";
import io from "socket.io-client";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "../../constant";

const dayjs = require("dayjs");
const SOCKET_SERVER_URL = "http://your-server-url:3000"; // Replace with your server's URL

const ChatChannel = () => {
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [socket, setSocket] = useState(null);
  const currentUser = auth()?.currentUser;

  // Initialize Socket.IO and handle connection
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      auth: {
        token: "your-jwt-token", // Replace with the actual JWT token
      },
    });
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join chat room and handle messages
  useEffect(() => {
    if (socket && currentUser) {
      // Request to join a specific chat room
      socket.emit("joinRoom", { chatRoomId: params.id, userId: currentUser.email });

      // Listen for incoming messages
      socket.on("chatMessage", (message) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [message]));
      });

      // Load previous messages when chat room ID changes
      socket.on("previousMessages", (previousMessages) => {
        setMessages(
          previousMessages.map((msg) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          }))
        );
      });
    }
  }, [socket, chatRoomId, currentUser]);

  const onSend = (newMessages = []) => {
    if (socket && chatRoomId) {
      const [message] = newMessages;
      socket.emit("chatMessage", {
        ...message,
        chatRoomId,
        user: {
          _id: currentUser.email,
          name: currentUser.displayName,
          avatar: currentUser.photoURL,
        },
      });
      setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    }
  };

  return (
    <>
      <SafeAreaView className="bg-primary p-2" edges={["top"]}>
        <View className="flex-row items-center gap-4 pl-2">
          <TouchableRipple
            className="rounded-full p-2"
            borderless
            onPress={() => router.back()}
          >
            <ArrowLeft size={25} color={"white"} strokeWidth={2} />
          </TouchableRipple>
          <View className="flex-row items-center ">
            <Avatar.Image
              source={{ uri: user2.logoUrl }}
              size={50}
            />
            <Text className="text-white font-semibold text-lg ml-4">{params.id}</Text>
          </View>
        </View>
      </SafeAreaView>
      <SafeAreaView className="flex-1 bg-white pb-4">
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          renderChatFooter={() => <View className="h-[20]" />}
          renderSend={(props) => (
            <SendMess {...props} containerStyle={{}}>
              <TouchableRipple className="rounded-full p-2" borderless>
                <Send color={"blue"} size={24} />
              </TouchableRipple>
            </SendMess>
          )}
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              containerStyle={{
                marginLeft: 15,
                marginRight: 15,
                backgroundColor: "white",
                alignContent: "center",
                justifyContent: "center",
                padding: 6,
                borderRadius: 30,
                borderTopColor: "white",
                borderWidth: 1,
                borderColor: Colors.primaryBackgroundColor,
                ...styles.shadow,
              }}
            />
          )}
          user={{
            _id: currentUser?.email,
            name: currentUser?.displayName,
            avatar: currentUser?.photoURL || "https://repository-images.githubusercontent.com/366884555/c2d2e700-b396-11eb-871e-2faafc8e4d07",
          }}
        />
      </SafeAreaView>
    </>
  );
};

export default ChatChannel;

const user2 = {
  id: 123,
  shopName: "Tiệm trà tháng năm",
  text: "This is test chate",
  logoUrl: "https://repository-images.githubusercontent.com/366884555/c2d2e700-b396-11eb-871e-2faafc8e4d07",
};

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[300],
    shadowOpacity: 0.2,
    elevation: 4,
  },
  shadowSelected: {
    shadowOffset: { width: 8, height: 8 },
    shadowColor: Colors.shadow.DEFAULT,
    shadowOpacity: 0.6,
    elevation: 20,
  },
});