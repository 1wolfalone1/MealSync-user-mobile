import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import qs from "qs";
import api from "../../api/api";
const initialState = {
  items: {},
  total: 0,
  listItemInfo: [],
  vouchers: [],
  listShopInfo: [],
  cartState: {
    idsRequest: [],
    isRemoveAllCart: false,
    isReceivingOrderPaused: false,
    isAcceptingOrderToday: false,
    isAcceptingOrderTomorrow: false,
    messageForAllCart: null,
    isPresentFoodNeedRemoveToday: true,
    idsNotFoundToday: [],
    messageFoodNeedRemoveToday: "",
    isPresentFoodNeedRemoveTomorrow: true,
    idsNotFoundTomorrow: [],
    messageFoodNeedRemoveTomorrow: "",
    foods: [],
  },
  status: {
    code: 200,
    message: "",
  },
};
const isSameCartItem = (item, itemNew) => {
  let isSameCheckBox = true;
  let isSameRadio = true;
  const checkbox = item.topping.checkbox;
  const radio = item.topping.radio;
  const checkboxNew = itemNew.topping.checkbox;
  const radioNew = itemNew.topping.radio;
  if (
    Object.keys(checkbox).length != Object.keys(checkboxNew).length ||
    Object.keys(radio).length != Object.keys(radioNew).length
  ) {
    return false;
  }

  Object.keys(checkbox).forEach((key) => {
    if (!checkboxNew[key]) {
      isSameCheckBox = false;
    } else {
      let isSameOption = false;
      const idSet = new Set(checkbox[key].map((item) => item.id));
      isSameOption = checkboxNew.every((item) => idSet.has(item.id));
      if (!isSameOption) {
        isSameCheckBox = false;
      }
    }
  });
  Object.keys(radio).forEach((key) => {
    if (!radioNew[key]) {
      isSameRadio = false;
    }
  });

  return isSameCheckBox && isSameRadio;
};
const findIdInProductIdString = (productId) => {
  if (productId) {
    if (Array.isArray(productId.split("-"))) {
      return productId.split("-")[0];
    }
  }
  return "";
};
const cartSlice = createSlice({
  name: "cartSlice",
  initialState: initialState,
  reducers: {
    changePriceItem: (state, actions) => {
      const { shopId, itemId, price } = actions.payload;
      if (state.items[shopId]) {
        state.items[shopId] = state.items[shopId].map((item) => {
          if (item.productId === itemId) {
            item.price = price;
            return item;
          } else {
            return item;
          }
        });
      }
    },
    setQuantity: (state, action) => {
      const { shopId, itemId, quantity } = action.payload;
      if (state.items[shopId]) {
        state.items[shopId] = state.items[shopId].map((item) => {
          if (item.productId === itemId) {
            item.quantity = quantity;
            return item;
          } else {
            return item;
          }
        });
      }
    },
    changeUserInfo: (state, actions) => {
      return actions.payload;
    },
    resetState: (state, actions) => initialState,
    resetStateListShop: (state, actions) => {
      state.listShopInfo = initialState.listShopInfo;
    },
    resetStateListItemInfo: (state, actions) => {
      state.listItemInfo = initialState.listItemInfo;
    },
    resetCartState: (state, actions) => {
      state.cartState = initialState.cartState;
    },
    removeItemInCart: (state, actions) => {
      const { shopId, itemId } = actions.payload;
      console.log(shopId, itemId, " remove item form cart");
      if (Array.isArray(state.items[shopId])) {
        console.log(shopId, itemId, " remove item form cart");
        state.items[shopId] = state.items[shopId].filter(
          (item) => item.productId != itemId
        );
        state.listItemInfo = state.listItemInfo.filter(
          (item) => item.id != itemId
        );
      }
    },
    setNote: (state, action) => {
      const { shopId, itemId, note, note2 } = action.payload;
      console.log(shopId, itemId, note, note2, " add note reducer");
      if (state.items[shopId]) {
        state.items[shopId].map((item) => {
          if (item.productId == itemId) {
            item.note = note;
            item.note2 = note2;
            return item;
          } else {
            return item;
          }
        });
      }
    },
    clearCart: (state, actions) => {
      const { shopId, operatingSlotId } = actions.payload;
      const tempList = state.items[shopId].filter(
        (item) => item.operatingSlotId != operatingSlotId
      );
      state.items[shopId] = tempList;
      state.listItemInfo = initialState.listItemInfo;
    },
    addToCart: (state, actions) => {
      const { price, productId, shopId, quantity, topping, operatingSlotId } =
        actions.payload;
      let newId = productId + "-operatingSlotId:" + operatingSlotId + "-radio:";
      let optionGroupRadio = [];
      let optionGroupCheckbox = [];
      Object.keys(topping.radio)
        .sort()
        .forEach((key, index) => {
          if (topping.radio[key]) {
            optionGroupRadio.push({
              id: key,
              optionId: topping.radio[key].optionId,
            });
            newId = newId + `(${key},${topping.radio[key].optionId})`;
          }
        });

      newId = newId + "|checkbox:";
      Object.keys(topping.checkbox)
        .sort()
        .forEach((key, index) => {
          if (topping.checkbox[key]) {
            if (topping.checkbox[key].options) {
              const optionIds = topping.checkbox[key].options.map(
                (option) => option.id
              );
              optionGroupCheckbox.push({
                id: key,
                optionIds: optionIds,
              });
              const newStringOption = `[${optionIds.sort().join(",")}]`;
              console.log(newStringOption, " new string option");
              newId = newId + `(${key},${newStringOption})`;
            }
          }
        });

      const carts = state.items;
      const cartItem = {
        productId: newId,
        optionGroupRadio,
        optionGroupCheckbox,
        quantity,
        topping,
        price,
        operatingSlotId,
      };
      if (Array.isArray(carts[shopId])) {
        let isExists = false;
        state.items[shopId] = state.items[shopId].map((item) => {
          if (item.productId === newId) {
            isExists = true;
            return cartItem;
          } else {
            return item;
          }
        });
        if (!isExists) {
          state.items[shopId].push(cartItem);
        }
      } else {
        state.items[shopId] = [];
        state.items[shopId].push(cartItem);
      }
    },
  },

  extraReducers: (builder) =>
    builder
      .addCase(getCartInfo.fulfilled, (state, action) => {
        console.log(action.payload, " payloiadddd ");
        console.log(action.payload, " tessssssssssssssssssssssssssssssssssss ");
        if (
          action.payload &&
          action.payload.foods &&
          Array.isArray(action.payload.foods)
        ) {
          state.listItemInfo = action.payload.foods;
        }
        state.cartState = action.payload;
      })
      .addCase(getCartInfo.rejected, (state, action) => {
        console.log(action.payload);
      })
      .addCase(getListShopInfo.fulfilled, (state, action) => {
        state.listShopInfo = action.payload;
      })
      .addCase(getListShopInfo.rejected, (state, action) => {
        console.log(action.payload);
      }),
});
export const getListShopInfo = createAsyncThunk(
  "cartSlice/getListShopInfo",
  async (id, { getState }) => {
    try {
      const state = getState().cartSlice;
      const keysArray = [];
      Object.keys(state.items).forEach((key) => {
        if (
          state.items[key] &&
          Array.isArray(state.items[key]) &&
          state.items[key].length != 0
        ) {
          keysArray.push(key);
        }
      });
      console.log(keysArray, "keys", state.items);
      const res = await api.get("/api/v1/shop/cart", {
        params: {
          ids: keysArray,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      });
      const data = await res.data;
      console.log(data, "Data cart shop info invoke");
      if (data.isSuccess) {
        return data.value;
      } else {
        return [];
      }
    } catch (err) {
      console.log(err, " error in getShopInfo in cartslice");
      throw err;
    }
  }
);
export const getCartInfo = createAsyncThunk(
  "cartSlice/getCartInfo",
  async ({ id, operatingSlotId }, { getState }) => {
    try {
      const state = getState().cartSlice;
      const listItem = state.items[id];
      let listIds = [];
      console.log(listItem, operatingSlotId, "list id food in cart");
      if (Array.isArray(listItem)) {
        const listItemByOperatingSlots = listItem.filter(
          (i) => i.operatingSlotId == operatingSlotId
        );
        console.log(listItemByOperatingSlots);
        listIds = listItemByOperatingSlots.map((item) => {
          return {
            id: item.productId,
            optionGroupRadio: item?.optionGroupRadio,
            optionGroupCheckbox: item?.optionGroupCheckbox,
          };
        });
      } else {
        return [];
      }
      console.log(listIds, " list id in for request cartttttttttttt");
      const res = await api.post("/api/v1/food", {
        shopId: id,
        operatingSlotId: operatingSlotId,
        foods: listIds,
      });
      console.log(res, " asfdasd asd fasdf asdf asf asf ");
      const data = await res.data;

      console.log(data, "Data cart invoke");
      if (data.isSuccess) {
        return data.value;
      } else {
        return [];
      }
    } catch (err) {
      console.log(err, " error in getCartInfo");
      throw err;
    }
  }
);
export default cartSlice;

export const cartSelector = (state) => state.cartSlice;
