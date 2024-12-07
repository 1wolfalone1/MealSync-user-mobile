import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
const initialState = {
  searchProductInHome: {
    data: null,
    loading: false,
    error: null,
    filter: {
      categoryId: 0,
      searchText: "",
      start: 0,
      end: 2400,
    },
    paging: {
      pageIndex: 1,
      pageSize: 20,
    },
    sort: {
      orderMode: 0,
      orderType: 1,
    },
  },
};
const searchSlice = createSlice({
  name: "searchSlice",
  initialState: initialState,
  reducers: {
    resetSearchProductInProduct: (state, product) => {
      state.searchProductInHome = initialState.searchProductInHome;
    },
    updateFilterInSearchProductInHome: (state, actions) => {
      state.searchProductInHome.filter = {
        ...state.searchProductInHome.filter,
        ...actions.payload,
      };
    },
    updatePagingInSearchProductInHome: (state, actions) => {
      state.searchProductInHome.paging = {
        ...state.searchProductInHome.paging,
        ...actions.payload,
      };
    },
    updateSortInSearchProductInHome: (state, actions) => {
      state.searchProductInHome.sort = {
        ...state.searchProductInHome.sort,
        ...actions.payload,
      };
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getListSearchProductInHome.fulfilled, (state, action) => {
        state.searchProductInHome.data = action.payload;
      })
      .addCase(getListSearchProductInHome.rejected, (state, action) => {
        console.log(action.payload);
      }),
});

export const getListSearchProductInHome = createAsyncThunk(
  "searchSlice/getListSearchProductInHome",
  async (data, { getState }) => {
    try {
      const state = getState().searchSlice;
      const res = await api.get("/api/v1/shop/search", {
        params: {
          searchValue: state.searchProductInHome.filter.searchText,
          platformCategoryId:
            state.searchProductInHome.filter.categoryId == 0
              ? undefined
              : state.searchProductInHome.filter.categoryId,
          order: state.searchProductInHome.sort.orderType,
          direct: state.searchProductInHome.sort.orderMode,
          startTime: state.searchProductInHome.filter.start,
          endTime: state.searchProductInHome.filter.end,
          ...state.searchProductInHome.paging,
        },
      });
      const data = await res.data;

      console.log(data, " data in get list search product in home");
      if (data.isSuccess) {
        return data.value.items;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error in getListSearchProductInHome:", error);
      throw error;
    }
  }
);
export default searchSlice;

export const searchSliceSelector = (state) => state.searchSlice;
