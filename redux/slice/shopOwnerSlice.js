import { createSlice } from '@reduxjs/toolkit';

const shopOwnerSlice = createSlice({
  name: 'shopOwnerSlice',
  initialState: {
    info: {},
    isRefreshOrder: false,
    idProductSelected: 0,
    idVoucherSelected: 0,
    bank: {},
  },
  reducers: {
    updateInfo: (state, actions) => {
      state.info = actions.payload;
    },
    saveIsRefreshOrder: (state, action) => {
      state.isRefreshOrder = action.payload;
    },
    saveIdProductSelected: (state, action) => {
      state.idProductSelected = action.payload;
    },
    saveIdVoucherSelected: (state, action) => {
      state.idVoucherSelected = action.payload;
    },
    saveBank: (state, action) => {
      state.bank = action.payload;
    },
  },
});

export default shopOwnerSlice;

export const shopOwnerSliceSelector = (state) => state.shopOwnerSlice;
