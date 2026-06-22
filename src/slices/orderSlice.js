import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getErrorMessage } from '../utils/api';

const initialState = {
  order: null,
  success: false,
  loading: false,
  error: null,
  myOrders: [],
  myOrdersLoading: false,
  myOrdersError: null,
  allOrders: [],
  allOrdersLoading: false,
  allOrdersError: null,
  payLoading: false,
  paySuccess: false,
  payError: null,
  statusLoading: false,
  statusSuccess: false,
  statusError: null,
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders', orderData);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'orders/getOrderDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const payOrder = createAsyncThunk(
  'orders/payOrder',
  async ({ orderId, paymentResult = { id: 'simulated_pay_id', status: 'COMPLETED', update_time: new Date().toISOString(), email_address: 'guest@chocoshop.com' } }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/pay`, paymentResult);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createRazorpayOrder = createAsyncThunk(
  'orders/createRazorpayOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/orders/${orderId}/razorpay-order`);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const verifyRazorpayPayment = createAsyncThunk(
  'orders/verifyRazorpayPayment',
  async ({ orderId, paymentResult }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/orders/${orderId}/verify-payment`, paymentResult);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders/myorders');
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getAllOrders = createAsyncThunk(
  'orders/getAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders');
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderStatus: (state) => {
      state.success = false;
      state.error = null;
      state.paySuccess = false;
      state.payError = null;
      state.statusSuccess = false;
      state.statusError = null;
    },
    clearOrderDetails: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Pay Order
      .addCase(payOrder.pending, (state) => {
        state.payLoading = true;
        state.paySuccess = false;
        state.payError = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.payLoading = false;
        state.paySuccess = true;
        state.order = action.payload;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.payLoading = false;
        state.payError = action.payload;
      })
      // Create Razorpay Order
      .addCase(createRazorpayOrder.pending, (state) => {
        state.payLoading = true;
        state.paySuccess = false;
        state.payError = null;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.payLoading = false;
        state.payError = action.payload;
      })
      // Verify Razorpay Payment
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.payLoading = true;
        state.paySuccess = false;
        state.payError = null;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.payLoading = false;
        state.paySuccess = true;
        state.order = action.payload;
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.payLoading = false;
        state.payError = action.payload;
      })
      // Get My Orders
      .addCase(getMyOrders.pending, (state) => {
        state.myOrdersLoading = true;
        state.myOrdersError = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrdersError = action.payload;
      })
      // Get All Orders (Admin)
      .addCase(getAllOrders.pending, (state) => {
        state.allOrdersLoading = true;
        state.allOrdersError = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.allOrdersLoading = false;
        state.allOrders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.allOrdersLoading = false;
        state.allOrdersError = action.payload;
      })
      // Update Order Status (Admin)
      .addCase(updateOrderStatus.pending, (state) => {
        state.statusLoading = true;
        state.statusSuccess = false;
        state.statusError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.statusLoading = false;
        state.statusSuccess = true;
        state.order = action.payload;
        state.allOrders = state.allOrders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.statusLoading = false;
        state.statusError = action.payload;
      });
  },
});

export const { resetOrderStatus, clearOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
