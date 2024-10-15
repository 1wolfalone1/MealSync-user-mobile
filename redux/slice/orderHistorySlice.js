import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import qs from 'qs';
import api from '../../api/api';
const initialState = {
  listOrderHistory: [],
  listOrderTracking: [],
  listOrderReview: [],
  orderReviewDetails: {
    shopName: '',
    logoUrl: ''
  }
};
const orderHistorySlice = createSlice({
  name: 'orderHistorySlice',
  initialState: initialState,
  reducers: {
    changeOrderReviewDetails: (state, actions) => {
      state.orderReviewDetails = actions.payload;
    }
  },
  extraReducers: (builder) =>
    builder
      .addCase(getListOrderHistory.fulfilled, (state, actions) => {
        console.log(actions.payload, ' actions payload in order history');
        state.listOrderHistory = actions.payload.items;
      })
      .addCase(getListOrderHistory.rejected, (state, actions) => {
        console.log(actions.payload);
      })
      .addCase(getListOrderTracking.fulfilled, (state, actions) => {
        console.log(actions.payload, ' actions payload in order history');
        state.listOrderTracking = actions.payload.items;
      })
      .addCase(getListOrderTracking.rejected, (state, actions) => {
        console.log(actions.payload);
      })
      .addCase(getListOrderReview.fulfilled, (state, actions) => {
        console.log(actions.payload, ' actions payload in order history');
        state.listOrderReview = actions.payload.items;
      })
      .addCase(getListOrderReview.rejected, (state, actions) => {
        console.log(actions.payload);
      })
});
export const getListOrderHistory = createAsyncThunk(
  'orderHistorySlice/getListOrderHistory',
  async ({ accountId, pageIndex, pageSize }, { getState }) => {
    try {
      const res = await api.get('/api/v1/customer/order/history', {
        params: {
          accountId: accountId,
          pageIndex: pageIndex,
          pageSize: pageSize,
          status: 4,
        },
      });

      const data = await res.data;
      console.log(data, ' order history api response');
      return data.value;
    } catch (e) {
      console.log(e);
    }
  },
);
export const  getListOrderReview= createAsyncThunk(
  'orderHistorySlice/getListOrderReview',

  async ({ accountId, pageIndex, pageSize }, { getState }) => {
    try {
      const res = await api.get('/api/v1/customer/order/history', {
        params: {
          accountId: accountId,
          pageIndex: pageIndex,
          pageSize: pageSize,
          status: [4],
          reviewMode: 1
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      });
      const data = await res.data;
      console.log(data, ' order tracking api response');
      return data.value;
    } catch (e) {
      console.log(e);
    }
  },
);

export const getListOrderTracking = createAsyncThunk(
  'orderHistorySlice/getListOrderHistory ',
  async ({ accountId, pageIndex, pageSize }, { getState }) => {
    try {
      const res = await api.get('/api/v1/customer/order/history', {
        params: {
          accountId: accountId,
          pageIndex: pageIndex,
          pageSize: pageSize,
          status: [1, 2, 3],
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      });
      const data = await res.data;
      console.log(data, ' order tracking api response');
      return data.value;
    } catch (e) {
      console.log(e);
    }
  },
);
export default orderHistorySlice;

export const orderHistorySliceSelector = (state) => state.orderHistorySlice;
