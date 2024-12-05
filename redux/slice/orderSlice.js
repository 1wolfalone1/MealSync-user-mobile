import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
const initialState = {
  products: [],
  itemsInCart: {},
  dataReorder: null,
  preDataReorder: null,
  shopId: 0,
  note: "",
  orderPrice: {
    total: 0,
    totalProduct: 0,
    voucher: 10000,
    shippingFee: 0,
  },
  voucherId: null,
  voucher: {},
  listVoucher: {
    active: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    inactive: [],
  },
  orderInfo: {
    fullName: "",
    phoneNumber: "",
    buildingId: 0,
    building: {
      address: "",
      latitude: 0,
      longitude: 0,
    },
  },
  ship: {
    distance: 1,
    duration: 1,
  },
};
const orderSlice = createSlice({
  name: "orderSlice",
  initialState: initialState,
  reducers: {
    setNoteReorder: (state, actions) => {
      const { itemId, note } = actions.payload;
      state.dataReorder.foods = state.dataReorder.foods.map((food) => {
        if (food.productId == itemId) {
          return {
            ...food,
            note: note,
          };
        }
        return food;
      });
    },
    setQuantityReorder: (state, actions) => {
      const { itemId, quantity } = actions.payload;
      state.dataReorder.foods = state.dataReorder.foods.map((food) => {
        if (food.productId == itemId) {
          food.quantity = quantity;
        }
        return food;
      });
    },
    changePriceItemReorder: (state, actions) => {
      const { itemId, price } = actions.payload;
      state.dataReorder.foods = state.dataReorder.foods.map((food) => {
        if (food.productId == itemId) {
          food.totalPrice = price;
        }
        return food;
      });
    },
    removeItemInCartReorder: (state, actions) => {
      const { itemId } = actions.payload;
      const tempList = state.dataReorder.foods.filter(
        (food) => food.productId != itemId
      );
      state.dataReorder.foods = tempList;
    },
    changePreDataReorder: (state, actions) => {
      state.preDataReorder = actions.payload;
    },

    changeFoodsReorder: (state, actions) => {
      if (actions.payload && Array.isArray(actions.payload)) {
        state.dataReorder.foods = actions.payload;
      }
    },
    changeDataReorder: (state, actions) => {
      state.dataReorder = actions.payload;
    },
    changeItemsInCart: (state, actions) => {
      state.itemsInCart = actions.payload;
    },
    changeProductsReorder: (state, actions) => {
      const items = actions.payload;
      state.products = items.map((i) => {
        const listOptionRadioIds = i.optionGroupRadio.map((i) => {
          return {
            id: i.id,
            optionId: i.option.id,
          };
        });
        const listOptionCheckboxIds = i.optionGroupCheckbox.map((i) => {
          return {
            id: i.id,
            optionIds: i.options.map((option) => {
              return option.id;
            }),
          };

        });
        return {
          id: i.productId,
          note: i.note ? i.note : "",
          quantity: i.quantity,
          optionGroupRadio: listOptionRadioIds,

          optionGroupCheckbox: listOptionCheckboxIds,
        };
      });
    },
    changeProducts: (state, actions) => {
      const products = actions.payload;
      console.log(products, " -------------products-------");

      state.products = products.map((product) => {
        const newToppingCheckbox = [];
        const newToppingRadio = [];
        Object.keys(product.topping.radio).forEach((key) => {
          const option = product.topping.radio[key];
          if (option) {
            newToppingRadio.push({
              id: key,
              optionId: option.optionId,
            });
          }
        });
        Object.keys(product.topping.checkbox).forEach((key) => {
          const topping = product.topping.checkbox[key];
          console.log(topping, " in lopppppppppppppppppppppppp");
          if (topping) {
            if (topping.options && Array.isArray(topping.options)) {
              const optionIds = topping.options.map((option) => option.id);
              console.log(optionIds, "optionIds");
              newToppingCheckbox.push({
                id: key,
                optionIds: optionIds,
              });
            }
          }
        });
        console.log(
          newToppingCheckbox,
          newToppingRadio,
          product.topping,
          product.productId,
          " ------- topping add---"
        );
        return {
          id: product.productId,
          quantity: product.quantity,
          note: product.note,
          optionGroupCheckbox: newToppingCheckbox,
          optionGroupRadio: newToppingRadio,
        };
      });
      console.log(products, " --- product for change");
    },
    changeNote: (state, actions) => {
      state.note = state.products.reduce((acc, current) => {
        if (current.note) {
          return acc + current.note + "\n";
        } else {
          return acc;
        }
      }, "");
    },
    changeShopId: (state, actions) => {
      const id = actions.payload;
      if (id) {
        state.shopId = id;
      }
    },
    resetVoucher: (state, action) => {
      state.voucher = initialState.voucher;
    },
    resetState: (state, actions) => {
      return initialState;
    },
    resetListVoucher: (state, actions) => {
      state.listVoucher = initialState.listVoucher;
    },
    changeShipInfo: (state, actions) => {
      const { distance, duration } = actions.payload;
      state.ship = {
        distance: distance,
        duration: duration,
      };
    },
    changeOrderInfoReorder: (state, actions) => {
      const { fullName, phoneNumber } = actions.payload;
      state.orderInfo = {
        ...state.orderInfo,
        fullName: fullName,
        phoneNumber: phoneNumber,
      };
    },
    changeOrderInfo: (state, actions) => {
      const { fullName, phoneNumber, building, buildingId } = actions.payload;
      state.orderInfo = {
        fullName: fullName,
        buildingId: buildingId,
        phoneNumber: phoneNumber,
        building: building,
      };
    },
    changeVoucher: (state, actions) => {
      const id = actions.payload;
      const selectVoucher = state.listVoucher.active.find((v) => {
        return v.id == id;
      });
      if (selectVoucher) {
        state.voucher = selectVoucher;
      }
      state.voucherId = id;
    },
    changeItems: (state, actions) => {},
    calculateTotalProductPriceReorder: (state, actions) => {
      const items = actions.payload;
      if (Array.isArray(items)) {
        const totalProductPrice = items.reduce(
          (acc, item) => acc + item.quantity * item.totalPrice,
          0
        );
        state.orderPrice.totalProduct = totalProductPrice;
      }
    },
    calculateTotalProductPrice: (state, actions) => {
      const items = actions.payload;
      if (Array.isArray(items)) {
        const totalProductPrice = items.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        );
        state.orderPrice.totalProduct = totalProductPrice;
      }
    },
    calculateTotal: (state, actions) => {},
    calculateVoucherPrice: (state, actions) => {
      const voucher = state.voucher;
      const totalProductPrice = state.orderPrice.totalProduct;
      const shippingFee = state.orderPrice.shippingFee;
      console.log(voucher, " voucher -----------------");
      if (voucher && voucher.id) {
        if (voucher.applyType == 1) {
          const listPrice = [];
          listPrice.push(voucher.maximumApplyValue);
          listPrice.push(
            parseInt(
              ((totalProductPrice + shippingFee) * voucher.amountRate) / 100
            )
          );
          console.log(listPrice, " list", Math.max(listPrice));
          state.orderPrice.voucher = Math.min(...listPrice);
        } else {
          state.orderPrice.voucher = voucher.amountValue;
        }
      } else {
        state.orderPrice.voucher = 0;
      }
    },
  },

  extraReducers: (builder) =>
    builder.addCase(getListVoucher.fulfilled, (state, actions) => {
      console.log(actions.payload, " payload in get liafsst voucher");
      state.listVoucher.active = actions.payload.eligibleList;
      state.listVoucher.inactive = actions.payload.ineligibleList;
    }),
});

export const getListVoucher = createAsyncThunk(
  "orderSlice/getListVoucher",
  async ({ shopId }, { getState }) => {
    try {
      const stateOrder = getState().orderSlice;
      console.log(Date.now(), "datata voucher list ne");
      const res = await api.get(`/api/v1/shop/${shopId}/promotion/filter`, {
        params: {
          totalPrice: stateOrder.orderPrice.totalProduct,
        },
      });
      const data = await res.data;
      console.log(data, "data get list voucher in order page");
      if (data.isSuccess) {
        return data.value;
      } else {
        return {
          promotionActive: [],
          promotionInActive: [],
        };
      }
    } catch (err) {
      console.log(err, " error in getlist voucher in order page");
      throw err;
    }
  }
);
export default orderSlice;

export const orderSelector = (state) => state.orderSlice;

export const orderTotalOrderSelector = (state) => {
  const orderPrice = state.orderSlice.orderPrice;
  const total =
    orderPrice.totalProduct + orderPrice.shippingFee - orderPrice.voucher;
  return total;
};
