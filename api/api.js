import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
const api = axios.create({
  baseURL: "https://api.mealsync.org",

  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

// api.defaults.paramsSerializer = (params) =>
//    qs.stringify(params, { arrayFormat: "repeat" });

api.interceptors.request.use(
  async (config) => {
    if (!config.headers.Authorization) {
      const token = await AsyncStorage.getItem("@token");

      console.log(token, " token for request ----------------");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log(config);
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error) => {
    console.log(error);
    if (error.response.status === 423) {
      console.log("error 423");
    } else if (error.response.status === 406) {
    } else if (error.response.status === 401) {
      console.log(error.response);
      router.navigate({
        pathname: "/",
        params: {
          messageError: "Bạn cần đăng nhập để tiếp tục sử dụng ứng dụng!",
        },
      });
    } else if (error.response.status === 403) {
      console.log(error.response);
      router.navigate({
        pathname: "/",
        params: {
          messageError: "Bạn cần đăng nhập để tiếp tục sử dụng ứng dụng!",
        },
      });
    } else {
      throw error;
    }
  }
);

export default api;
