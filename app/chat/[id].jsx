import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Camera, Play, Send, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send as SendMess,
} from "react-native-gifted-chat";
import { Avatar, IconButton, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import { Colors } from "../../constant";
import globalSlice, { globalSelector } from "../../redux/slice/globalSlice";
import { userInfoSliceSelector } from "../../redux/slice/userSlice";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PREVIEW_HEIGHT = 150;

const MediaPreview = ({ media, onRemove }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  if (!media) return null;

  if (media.type === "image") {
    return (
      <View style={styles.mediaPreviewItem}>
        <Image
          source={{ uri: media.uri }}
          style={styles.previewImage}
          resizeMode="cover"
        />
        <IconButton
          icon={() => <X size={20} color="white" />}
          onPress={onRemove}
          style={styles.removeButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.mediaPreviewItem}>
      <Video
        ref={videoRef}
        source={{ uri: media.uri }}
        style={styles.previewVideo}
        resizeMode={ResizeMode.COVER}
        isLooping
        onPlaybackStatusUpdate={(status) => setIsPlaying(status.isPlaying)}
      />
      <Pressable
        style={[styles.playButton, isPlaying && styles.playButtonHidden]}
        onPress={togglePlayback}
      >
        <Play size={30} color="white" />
      </Pressable>
      <IconButton
        icon={() => <X size={20} color="white" />}
        onPress={onRemove}
        style={styles.removeButton}
      />
    </View>
  );
};

const CustomInputToolbar = ({ selectedMedia, onRemoveMedia, ...props }) => {
  return (
    <View style={styles.inputContainer}>
      {selectedMedia && (
        <View style={styles.mediaPreviewContainer}>
          <MediaPreview media={selectedMedia} onRemove={onRemoveMedia} />
        </View>
      )}
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "white",
          alignContent: "center",
          justifyContent: "center",
          padding: 6,
          height: 50,
          borderRadius: 30,
          borderWidth: 1,
          borderColor: Colors.primaryBackgroundColor,
          marginHorizontal: 15,
          marginBottom: 4,
          ...styles.shadow,
        }}
      />
    </View>
  );
};
const MessageVideo = ({ currentMessage }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  return (
    <>
      <View style={styles.messageVideoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: currentMessage.video }}
          style={styles.messageVideo}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
        {!status.isPlaying && (
          <Pressable
            style={styles.messagePlayButton}
            onPress={() => videoRef.current?.playAsync()}
          >
            <Play size={30} color="white" />
          </Pressable>
        )}
      </View>
    </>
  );
};
const ChatChannel = () => {
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(null);
  const [chatData, setChatData] = useState(null);
  const userInfo = useSelector(userInfoSliceSelector);
  const { socket } = useSelector(globalSelector);
  const pickMedia = async () => {
    try {
      if (Platform.OS !== "web") {
        const libraryStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libraryStatus.status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }

        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== "granted") {
          alert("Sorry, we need camera permissions to make this work!");
        }
      }

      console.log("Picking media");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60,
      });
      console.log(result);
      if (!result.canceled) {
        const asset = result.assets[0];
        console.log(result, "result");

        const mediaUrl = await uploadMedia(asset.uri, asset.type);
        if (mediaUrl) {
          setSelectedMedia({
            uri: asset.uri,
            type:
              asset.type || (asset.uri.endsWith(".mp4") ? "video" : "image"),
            preview: true,
          });
          console.log(mediaUrl, "uploadMedia");
          setSelectedMediaUrl(mediaUrl);
        }
      }
    } catch (error) {
      console.log(error, " error pick media in chat");
      Alert.alert("Error", "Failed to pick media");
    }
  };

  const uploadMedia = async (uri, fileType) => {
    try {
      const formData = new FormData();

      // Append the file with a specific Content-Type
      formData.append("file", {
        uri,
        name: `media-${Date.now()}.${fileType === "video" ? "mp4" : "jpg"}`,
        type: fileType === "video" ? "video/mp4" : "image/jpeg", // Ensure correct MIME type
      });

      // Upload the formData using the appropriate headers
      const res = await api.put(`/api/v1/storage/file/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // This ensures the entire request is recognized as multipart/form-data
        },
      });

      const data = await res.data;
      if (data.isSuccess) {
        return data?.value?.url;
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };
  const handleGetChatData = async () => {
    try {
      console.log("asdfasdfasdfasfasfd -----------------------------");

      const res = await api.get(`/api/v1/order/${params.id}/chat-info`);
      console.log(res, "asdfasdfasdf");
      const data = await res.data;
      console.log(data, "data ssssssssssssssssssss");
      if (data.isSuccess) {
        setChatData(data.value);
      }
    } catch (error) {
      console.error(error, " erorsefasdfasf");
    }
  };
  const dispatch = useDispatch()
  useEffect(() => {
    handleGetChatData();
    dispatch(globalSlice.actions.setCurrentScreen("chat"))
    return () => {
    dispatch(globalSlice.actions.setCurrentScreen(""))
    };
  }, []);
  useEffect(() => {
    console.log(socket, " socket ne ", chatData);
    if (chatData) {
      try {
        socket.emit("joinRoomsChat", {
          chatRoomId: Number(params.id),
          chatData,
        });
        socket.on("chatMessage", (msg) => {
          console.log(msg, "chatMessage");
          let user = {};
          if (msg.role_id === 1) {
            user = {
              _id: chatData.customer.id,
              name: chatData.customer.fullName,
              avatar: chatData.avatarUrl,
            };
          } else if (msg.role_id === 2) {
            user = {
              _id: chatData.shop.id,
              name: chatData.shop.fullName,
              avatar: chatData.shop.avatarUrl,
            };
          } else {
            user = {
              _id: chatData.deliveryStaff.id,
              name: chatData.deliveryStaff.fullName,
              avatar: chatData.deliveryStaff.avatarUrl,
            };
          }
          console.log(user, " user for chatg");
          if (user._id == userInfo.id) {
            return;
          }
          let imageUrl = null;
          let videoUrl = null;
          if (msg.file_url) {
            if (msg.file_url.includes("video")) {
              videoUrl = msg.file_url;
            } else {
              imageUrl = msg.file_url;
            }
          }
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [
              {
                _id: msg.id,
                text: msg.message,
                image: imageUrl,
                video: videoUrl,
                user,
                createdAt: new Date(msg.created_at),
              },
            ])
          );
        });

        socket.on("previousMessages", (previousMessages) => {
          console.log(previousMessages, "previousMessages");
          setMessages(
            previousMessages.map((msg) => {
              let user = {};
              if (msg.role_id === 1) {
                user = {
                  _id: chatData.customer.id,
                  name: chatData.customer.fullName,
                  avatar: chatData.avatarUrl,
                };
              } else if (msg.role_id === 2) {
                user = {
                  _id: chatData.shop.id,
                  name: chatData.shop.fullName,
                  avatar: chatData.shop.avatarUrl,
                };
              } else {
                user = {
                  _id: chatData.deliveryStaff.id,
                  name: chatData.deliveryStaff.fullName,
                  avatar: chatData.deliveryStaff.avatarUrl,
                };
              }
              console.log(user, "userrrrrrrrrrrrrr");
              let imageUrl = null;
              let videoUrl = null;
              if (msg.file_url) {
                if (msg.file_url.includes("video")) {
                  videoUrl = msg.file_url;
                } else {
                  imageUrl = msg.file_url;
                }
              }
              return {
                _id: msg.id,
                text: msg.message,
                image: imageUrl,
                video: videoUrl,
                user,
                createdAt: new Date(msg.created_at),
              };
            })
          );
        });

        setChatRoomId(params.id);
      } catch (error) {
        console.log("Error:", error);
      }
    }
    return () => {};
  }, [chatData]);

  const onSend = async (newMessages = []) => {
    try {
      if (!socket) return;

      const [message] = newMessages;
      console.log(message, " new messages");
      const messageToSend = {
        text: message.text,
        chatRoomId: Number(params.id),
        image: selectedMedia?.type === "image" ? selectedMediaUrl : null,
        video: selectedMedia?.type === "video" ? selectedMediaUrl : null,
        userId: userInfo.id,
        id: message._id,
        fullName: userInfo.fullName,
        avatarUrl: userInfo.avatarUrl
      };
      setSelectedMedia(null);
      setSelectedMediaUrl(null);
      socket.emit("chatMessage", messageToSend);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          {
            ...message,
            image: messageToSend.image,
            video: messageToSend.video,
          },
        ])
      );
    } catch (error) {
      Alert.alert("Error", "Failed to send message");
    }
  };

  const renderMessageVideo = (props) => {
    const { currentMessage } = props;
    const videoRef = useRef(null);
    const [status, setStatus] = useState({});

    return (
      <View style={styles.messageVideoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: currentMessage.video }}
          style={styles.messageVideo}
          useNativeControls
          resizeMode={ResizeMode.COVER}
          isLooping={false}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
        {!status.isPlaying && (
          <Pressable
            style={styles.messagePlayButton}
            onPress={() => videoRef.current?.playAsync()}
          >
            <Play size={30} color="white" />
          </Pressable>
        )}
      </View>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#f0f0f0",
          },
          right: {
            backgroundColor: Colors.primaryBackgroundColor,
          },
        }}
        renderMessageImage={(messageImageProps) => (
          <Image
            source={{ uri: messageImageProps.currentMessage.image }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}
        renderMessageVideo={(props) => (
          <MessageVideo currentMessage={props.currentMessage} />
        )}
      />
    );
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
            <Avatar.Image source={{ uri: userInfo.avatarUrl }} size={50} />
            <Text className="text-white font-semibold text-lg ml-4">
              {userInfo.fullName}
            </Text>
          </View>
        </View>
      </SafeAreaView>
      <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          renderBubble={renderBubble}
          renderInputToolbar={(props) => (
            <CustomInputToolbar
              {...props}
              selectedMedia={selectedMedia}
              onRemoveMedia={async () => {
                setSelectedMedia(null);
                try {
                  const res = await api.delete(
                    `/api/v1/storage/file/delete?url=${selectedMediaUrl}`
                  );
                  const data = await res.data;
                  console.log(data, " result after delete image");
                  setSelectedMediaUrl(null);
                } catch (e) {
                  console.log("Error remove media:", e);
                }
              }}
            />
          )}
          renderComposer={(props) => (
            <View style={styles.composerContainer}>
              <TouchableRipple onPress={pickMedia} style={styles.mediaButton}>
                <Camera size={24} color={Colors.primaryBackgroundColor} />
              </TouchableRipple>
              <Composer {...props} textInputStyle={styles.textInput} />
            </View>
          )}
          renderSend={(props) => (
            <SendMess {...props} containerStyle={styles.sendButton}>
              <TouchableRipple className="rounded-full p-2" borderless>
                <Send color={Colors.primaryBackgroundColor} size={24} />
              </TouchableRipple>
            </SendMess>
          )}
          user={{
            _id: userInfo.id,
            name: userInfo.fullName,
            avatar: userInfo.avatarUrl,
          }}
          minInputToolbarHeight={selectedMedia ? 150 : 60}
        />
      </SafeAreaView>
    </>
  );
};
export default ChatChannel;
const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "white",
  },
  mediaPreviewContainer: {
    height: PREVIEW_HEIGHT,
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
  },
  mediaPreviewItem: {
    height: PREVIEW_HEIGHT - 16,
    width: PREVIEW_HEIGHT - 16,
    marginHorizontal: 15,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f0f0f0",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewVideo: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    margin: 0,
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -15 }, { translateY: -15 }],
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 10,
  },
  playButtonHidden: {
    opacity: 0,
  },
  composerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 4,
  },
  textInput: {
    flex: 1,
    marginLeft: 4,
    fontSize: 16,
    lineHeight: 16,
    marginTop: 6,
    marginBottom: 6,
    paddingTop: 0,
    paddingBottom: 0,
  },
  mediaButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    height: 44,
    justifyContent: "center",
    marginRight: 4,
  },
  messageVideoContainer: {
    position: "relative",
    backgroundColor: "white",
    height: 200,
    minWidth: 200,
    borderRadius: 13,
    margin: 3,
  },
  messageVideo: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  messagePlayButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -15 }, { translateY: -15 }],
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 10,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 13,
    margin: 3,
  },
  shadow: {
    shadowOffset: { width: 0, height: 1 },
    shadowColor: Colors.shadow[300],
    shadowOpacity: 0.15,
    elevation: 2,
  },
});