import { createSlice } from '@reduxjs/toolkit';

const persistSlice = createSlice({
  name: 'persistSlice',
  initialState: {
    tempOrder: {},
    emailTemp: '',
    verifyId: 0,
    isReset: false,
    isSignup: false,
    code: '',
  },
  reducers: {
    saveTempOrder: (state, action) => {
      state.tempOrder = action.payload;
    },
    clearTempOrder: (state, action) => {
      state.tempOrder = {};
    },
    saveEmailTemp: (state, action) => {
      state.emailTemp = action.payload;
    },
    clearEmailTemp: (state, action) => {
      state.emailTemp = '';
    },
    saveVerifyId: (state, action) => {
      state.verifyId = action.payload;
    },
    saveCode: (state, action) => {
      state.code = action.payload;
    },
    saveIsReset: (state, action) => {
      state.isReset = action.payload;
    },
    saveIsSignup: (state, action) => {
      state.isSignup = action.payload;
    },
  },
});

export default persistSlice;

export const persistSliceSelector = (state) => state.persistSlice;
