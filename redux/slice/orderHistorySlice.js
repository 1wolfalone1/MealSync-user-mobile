import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import qs from "qs";
import api from "../../api/api";
const initialState = {
  listOrderHistory: [],
  listOrderTracking: [],
  listOrderReview: [],
  listOrderIssues: [],
  totalPage: 0,
  totalPage2: 0,
  totalPage3: 0,
  totalPage4: 0,
  orderReviewDetails: {
    shopName: "",
    logoUrl: "",
  },
};
const orderHistorySlice = createSlice({
  name: "orderHistorySlice",
  initialState: initialState,
  reducers: {
    changeOrderReviewDetails: (state, actions) => {
      state.orderReviewDetails = actions.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getListOrderHistory.fulfilled, (state, actions) => {
        console.log(actions.payload, " actions payload in order history 2");

        state.totalPage2 = actions.payload.totalPages;
        if (actions.payload.pageIndex == 1) {
          state.listOrderHistory = actions.payload.items;
        } else {
          state.listOrderHistory = [
            ...state.listOrderHistory,
            ...actions.payload.items,
          ];
        }
      })
      .addCase(getListOrderHistory.rejected, (state, actions) => {
        console.log(actions.payload);
      })
      .addCase(getListOrderTracking.fulfilled, (state, actions) => {
        console.log(actions.payload, " actions payload in order history");
        state.totalPage = actions.payload.totalPages;
        if (actions.payload.pageIndex == 1) {
          state.listOrderTracking = actions.payload.items;
        } else {
          state.listOrderTracking = [
            ...state.listOrderTracking,
            ...actions.payload.items,
          ];
        }
      })
      .addCase(getListOrderTracking.rejected, (state, actions) => {
        console.log(actions.payload);
      })
      .addCase(getListOrderReview.fulfilled, (state, actions) => {
        console.log(actions.payload, " actions payload in order history");
        state.listOrderReview = actions.payload.items;
      })
      .addCase(getListOrderReview.rejected, (state, actions) => {
        console.log(actions.payload);
      })
      .addCase(getOrderIssues.fulfilled, (state, actions) => {
        console.log(actions.payload, " actions payload in order history");
        state.totalPage4 = actions.payload.totalPages;
        if (actions.payload.pageIndex == 1) {
          state.listOrderIssues = actions.payload.items;
        } else {
          state.listOrderIssues = [
            ...state.listOrderIssues,
            ...actions.payload.items,
          ];
        }
      })
      .addCase(getOrderIssues.rejected, (state, actions) => {
        console.log(actions.payload);
      }),
});
export const getOrderIssues = createAsyncThunk(
  "orderHistorySlice/getOrderIssues",
  async ({ accountId, pageIndex, pageSize }, { getState }) => {
    try {
      const res = await api.get("/api/v1/customer/order/history", {
        params: {
          accountId: accountId,
          pageIndex: pageIndex,
          pageSize: pageSize,
          status: [8, 10, 11],
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      });
      const data = await res.data;
      console.log(data, " order history api response");
      return data.value;
    } catch (e) {
      console.log(e);
    }
  }
);
export const getListOrderHistory = createAsyncThunk(
  "orderHistorySlice/getListOrderHistory",
  async ({ accountId, pageIndex, pageSize }, { getState }) => {
    try {
      const res = await api.get("/api/v1/customer/order/history", {
        params: {
          accountId: accountId,
          pageIndex: pageIndex,
          pageSize: pageSize,
          status: [9, 12, 2, 4],
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      });
      const data = await res.data;
      console.log(data, " order history api response");
      return data.value;
    } catch (e) {
      console.log(e);
    }
  }
);
export const getListOrderReview = createAsyncThunk(
  "orderHistorySlice/getListOrderReview",

  async ({ accountId, pageIndex, pageSize }, { getState }) => {
    try {
      const res = await api.get("/api/v1/customer/order/history", {
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          status: [9, 7, 10, 11, 12],
          reviewMode: true,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      });
      const data = await res.data;
      console.log(data, " order tracking api response");
      return data.value;
    } catch (e) {
      console.log(e);
    }
  }
);

export const getListOrderTracking = createAsyncThunk(
  "orderHistorySlice/getListOrderHistory ",
  async ({ accountId, pageIndex, pageSize }, { getState }) => {
    try {
      console.log("page size", pageIndex);
      const res = await api.get("/api/v1/customer/order/history", {
        params: {
          accountId: accountId,
          pageIndex: pageIndex,
          pageSize: pageSize,
          status: [1, 3, 5, 6, 7],
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      });
      const data = await res.data;
      console.log(data, " order tracking api response");
      return {
        pageIndex: pageIndex,
        ...data.value,
      };
    } catch (e) {
      console.log(e);
    }
  }
);
export default orderHistorySlice;

export const orderHistorySliceSelector = (state) => state.orderHistorySlice;
