import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';
const initialState = {
  products: {},
  shopId: 0,
  orderPrice: {
    total: 0,
    totalProduct: 0,
    voucher: 10000,
    shippingFee: 0,
  },
  voucher: {},
  listVoucher: {
    active: [],
    inactive: [],
  },
  orderInfo: {
    fullName: '',
    phoneNumber: '',
    building: {
      address: '',
      latitude: 0,
      longitude: 0,
    },
  },
  ship: {
    distance: 0,
    duration: 0,
  },
};
const orderSlice = createSlice({
  name: 'orderSlice',
  initialState: initialState,
  reducers: {
    changeProducts: (state, actions) => {
      const products = actions.payload;
      console.log(products, ' -------------products-------');

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
          console.log(topping, ' in lopppppppppppppppppppppppp');
          if (topping) {
            if (topping.options && Array.isArray(topping.options)) {
              const optionIds = topping.options.map((option) => option.id);
              console.log(optionIds, 'optionIds');
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
          ' ------- topping add---',
        );
        return {
          ...product,
          topping: {
            checkbox: newToppingCheckbox,
            radio: newToppingRadio,
          },
        };
      });
      console.log(products, ' --- product for change');
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
      if (id) {
        const parseIdArr = id.split('-');
        const selectVoucher = state.listVoucher.active.find((v) => {
          return v.id == parseIdArr[0] && v.promotionType == parseIdArr[1];
        });
        state.voucher = selectVoucher;
      }
    },
    changeItems: (state, actions) => {},
    calculateTotalProductPrice: (state, actions) => {
      const items = actions.payload;
      if (Array.isArray(items)) {
        const totalProductPrice = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        state.orderPrice.totalProduct = totalProductPrice;
      }
    },
    calculateTotal: (state, actions) => {

    },
    calculateVoucherPrice: (state, actions) => {
      const voucher = state.voucher;
      const totalProductPrice = state.orderPrice.totalProduct;
      const shippingFee = state.orderPrice.shippingFee;
      console.log(voucher, ' voucher -----------------');
      if (voucher && voucher.id) {
        if (voucher.applyType == 1) {
          const listPrice = [];
          listPrice.push(voucher.maximumApplyValue);
          listPrice.push(parseInt(((totalProductPrice + shippingFee) * voucher.amountRate) / 100));
          console.log(listPrice, ' list', Math.max(listPrice));
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
      console.log(actions.payload, ' payload in get liafsst voucher');
      state.listVoucher.active = actions.payload.promotionActive.items;
      state.listVoucher.inactive = actions.payload.promotionInActive.items;
    }),
});

export const getListVoucher = createAsyncThunk(
  'orderSlice/getListVoucher',
  async ({ shopId, userId, distance }, { getState }) => {
    try {
      const stateOrder = getState().orderSlice;
      console.log(Date.now(), 'datata voucher list ne');
      const res = await api.get('/api/v1/customer/promotion/all', {
        params: {
          shopId: shopId,
          customerId: userId,
          orderValue: stateOrder.orderPrice.totalProduct + stateOrder.orderPrice.shippingFee,
          distance: distance,
          currentDate: '2024-06-01',
        },
      });
      const data = await res.data;
      console.log(data, 'data get list voucher in order page');
      if (data.isSuccess) {
        return data.value;
      } else {
        return {
          promotionActive: [],
          promotionInActive: [],
        };
      }
    } catch (err) {
      console.log(err, ' error in getlist voucher in order page');
      throw err;
    }
  },
);
export default orderSlice;

export const orderSelector = (state) => state.orderSlice;

export const orderTotalOrderSelector = (state) => {
  const orderPrice = state.orderSlice.orderPrice;
  const total = orderPrice.totalProduct + orderPrice.shippingFee - orderPrice.voucher;
  return total;
};
