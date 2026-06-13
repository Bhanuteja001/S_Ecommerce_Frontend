import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getErrorMessage } from '../utils/api';

// Helper to get local cart items
const getLocalCart = () => {
  return localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [];
};

const initialState = {
  cartItems: getLocalCart(),
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (auth.userInfo) {
        const { data } = await api.get('/cart');
        // Standardize the shape
        return data.cartItems || [];
      }
      return getLocalCart();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const addToCartServer = createAsyncThunk(
  'cart/addToCartServer',
  async ({ product, quantity }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (auth.userInfo) {
        const { data } = await api.post('/cart', {
          productId: product._id,
          quantity,
        });
        return data.cartItems || [];
      } else {
        // Guest cart handling
        const localCart = getLocalCart();
        const existItem = localCart.find((x) => x.product._id === product._id);

        let newCart;
        if (existItem) {
          newCart = localCart.map((x) =>
            x.product._id === product._id ? { ...x, quantity } : x
          );
        } else {
          newCart = [...localCart, { product, quantity }];
        }
        localStorage.setItem('cartItems', JSON.stringify(newCart));
        return newCart;
      }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const removeFromCartServer = createAsyncThunk(
  'cart/removeFromCartServer',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (auth.userInfo) {
        const { data } = await api.delete(`/cart/${productId}`);
        return data.cartItems || [];
      } else {
        // Guest cart handling
        const localCart = getLocalCart();
        const newCart = localCart.filter((x) => x.product._id !== productId);
        localStorage.setItem('cartItems', JSON.stringify(newCart));
        return newCart;
      }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const clearCartServer = createAsyncThunk(
  'cart/clearCartServer',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (auth.userInfo) {
        await api.delete('/cart');
      }
      localStorage.removeItem('cartItems');
      return [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Sync local guest cart items with server cart after login
export const mergeLocalCartWithServer = createAsyncThunk(
  'cart/mergeLocalCartWithServer',
  async (_, { getState, dispatch }) => {
    const { auth } = getState();
    if (!auth.userInfo) return;

    const localCart = getLocalCart();
    if (localCart.length === 0) {
      dispatch(fetchCart());
      return;
    }

    try {
      // Sync guest cart items to the server sequentially
      for (const item of localCart) {
        await api.post('/cart', {
          productId: item.product._id,
          quantity: item.quantity,
        });
      }
      // Clear local guest cart now that it is synced
      localStorage.removeItem('cartItems');
      dispatch(fetchCart());
    } catch (error) {
      console.error('Error syncing guest cart with server', error);
      dispatch(fetchCart());
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    logoutCart: (state) => {
      state.cartItems = [];
      state.error = null;
      localStorage.removeItem('cartItems');
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add To Cart
      .addCase(addToCartServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartServer.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(addToCartServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove From Cart
      .addCase(removeFromCartServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartServer.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(removeFromCartServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear Cart
      .addCase(clearCartServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartServer.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(clearCartServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutCart } = cartSlice.actions;
export default cartSlice.reducer;
