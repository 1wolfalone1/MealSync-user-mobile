import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';
import { CommonConstants } from '../../constant';

const initialState = {
  info: {
    name: '',
    phoneNumber: '',
    email: '',
    building: {
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
    },
    avatarUrl: '',
  },
  role: CommonConstants.USER_ROLE.GUEST,
};
const userInfoSlice = createSlice({
  name: 'userInfoSlice',
  initialState: initialState,
  reducers: {
    changeUserInfo: (state, actions) => {
      console.log(actions.payload, ' changing user info');
      return actions.payload;
    },
    resetState: (state, actions) => initialState,
  },
  extraReducers: (builder) =>
    builder
      .addCase(loadInfo.fulfilled, (state, action) => {
        return {
          info: action.payload,
          role: CommonConstants.USER_ROLE.USER,
        };
      })
      .addCase(loadInfo.rejected, (state, action) => {
        return {
          info: {},
          role: CommonConstants.USER_ROLE.GUEST,
        };
      }),
});

export default userInfoSlice;

export const loadInfo = createAsyncThunk('userSlice/loadInfo', async () => {
  try {
    const res = await api.get('/api/v1/customer');
    const data = await res.data;
    console.log(data);
    return data.value;
  } catch (e) {
    console.log(e);
  }
});
export const userInfoSliceSelector = (state) => {
  return state.userInfoSlice.info;
};

export const userRoleSelector = (state) => state.userInfoSlice.role;

export const authenticate = createAsyncThunk('userInfo/authenticate', async () => {});
