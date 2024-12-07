import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Slot } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  PermissionsAndroid,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { showToastable } from "react-native-toastable";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import api from "../../../api/api";
import NotifyFisebaseForegroundItem from "../../../components/common/NotifyFisebaseForegroundItem";
import CategoryItemInHome from "../../../components/user-page/CategoryItemInHome";
import DynamicHeader from "../../../components/user-page/HeaderAnimated";
import globalSlice, { globalSelector } from "../../../redux/slice/globalSlice";
import searchSlice from "../../../redux/slice/searchSlice";
import {
  loadInfo,
  userInfoSliceSelector,
} from "../../../redux/slice/userSlice";

import messaging from "@react-native-firebase/messaging";
import usePullToRefresh from "../../../custom-hook/usePullToRefresh";
const styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
    paddingBottom: 0,
  },
  scrollText: {
    fontSize: 19,
    textAlign: "center",
    padding: 20,
    color: "#000",
  },
});
const blankData = [null, null, null, null, null];
const HomePage = () => {
  const { socket, currentScreen, searchPage } = useSelector(globalSelector);
  const info = useSelector(userInfoSliceSelector);
  const dispatch = useDispatch();
  console.log(currentScreen, " ?????????????");
  const currentScreenRef = useRef(currentScreen);
  const requestUserPermissions = async (req, res) => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };
  const handleRegistrationDevice = async (token) => {
    try {
      console.log("Registration device token", token);
      const res = await api.put("/api/v1/auth/device-token", {
        deviceToken: token,
      });
      const data = await res.data;
      console.log(data, " successfully registered device");
    } catch (err) {
      console.log(err, " cannot register device");
    }
  };
  useEffect(() => {
    if (requestUserPermissions()) {
      messaging()
        .getToken()
        .then((token) => {
          console.log(token, " device tokenn");
          if (info) handleRegistrationDevice(token);
        })
        .catch((err) => {
          console.log(err, " cannot register device in message()");
        });
    } else {
      console.log("Permission denied");
    }
  }, [info]);
  // Update ref whenever currentScreen changes
  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);
  const handleRunToast = (message) => {
    // Use the ref value instead of the closed over value
    const currentScreenValue = currentScreenRef.current;

    console.log(currentScreenValue, message, " message websocket");

    if (message.Type == 200) {
      if (currentScreenValue == "chat" || currentScreenValue == "chatList") {
        return;
      }
    }
    console.log(message.EntityType, " message websocket type");
    if (message.EntityType == 1) {
      dispatch(globalSlice.actions.notifyOrderStatusChange());
    }
    showToastable({
      renderContent: () => <NotifyFisebaseForegroundItem {...message} />,
    });
  };
  const initializeSocket = async () => {
    try {
      const token = await AsyncStorage.getItem("@token"); // Retrieve token from AsyncStorage

      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        return;
      }

      // Connect to the server with JWT authentication
      const newSocket = io("https://socketio.1wolfalone1.com/", {
        auth: {
          token: token,
        },
        transports: ["websocket", "polling"],
      });

      // Listen for notifications from the server
      newSocket.on("notification", (message) => {
        try {
          handleRunToast(message);
        } catch (err) {
          console.error("Failed to show toastable:", err);
        }
      });

      // Handle connection errors
      newSocket.on("connect_error", (error) => {
        console.error("Connection Error:", error);
        Alert.alert("Connection Error", error.message);
      });

      // Save socket instance for cleanup
      dispatch(globalSlice.actions.setSocket(newSocket));
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    } catch (error) {
      console.log("Error retrieving token:", error);
      Alert.alert("Error", "Failed to retrieve token. Please log in again.");
    }
  };

  useEffect(() => {
    // Function to initialize socket connection with token from AsyncStorage
    if (socket) {
    } else {
      initializeSocket();
    }

    // Cleanup function to disconnect the socket on unmount
    return () => {
      if (socket) {
      }
    };
  }, []);
  const [categories, setCategories] = useState(null);
  const [idCategorySelected, setCategorySelected] = useState(0);
  const handleGetCategories = async () => {
    try {
      const res = await api.get("api/v1/platform-category");
      const data = await res.data;
      setCategories(data.value);
      console.log(data.value, " category");
    } catch (err) {
      console.log(err, " error in DynamicHeader");
    }
  };

  const handleClickCategory = (id) => {
    if (id == idCategorySelected) {
      setCategorySelected(0);
      dispatch(
        searchSlice.actions.updateFilterInSearchProductInHome({
          categoryId: 0,
        })
      );
    } else {
      setCategorySelected(id);
      dispatch(
        searchSlice.actions.updateFilterInSearchProductInHome({
          categoryId: id,
        })
      );
    }
    if (!searchPage) {
      router.replace("/home/search-list");
    }
  };
  let scrollOffsetY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    handleGetCategories();
    dispatch(loadInfo());
  }, []);
  const { refreshing, onRefreshHandler } = usePullToRefresh({
    onRefreshFunction() {
      dispatch(globalSlice.actions.changeRefreshScroll());
    },
  });
  return (
    <SafeAreaView
      style={styles.container}
      className="bg-white"
      edges={["top", "right", "left"]}
    >
      <DynamicHeader animHeaderValue={scrollOffsetY} />
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        style={{
          flex: 1,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          {
            useNativeDriver: false,
          }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshHandler}
          />
        }
      >
        <View className="flex-1">
          <View className="flex-row mt-2">
            <FlatList
              contentContainerStyle={{ paddingLeft: 28, paddingVertical: 8 }}
              horizontal
              data={categories ? categories : blankData}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <CategoryItemInHome
                  item={item}
                  idCategorySelected={idCategorySelected}
                  setCategorySelected={handleClickCategory}
                />
              )}
            />
          </View>
        </View>
        <Slot screenOptions={{}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;
