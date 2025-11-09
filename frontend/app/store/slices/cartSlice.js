import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],       // { productId, name, price, quantity }
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product } = action.payload;
      const index = state.items.findIndex(item => item.productId === product.productId);

      if (index >= 0) {
        state.items[index].quantity += product.quantity;
      } else {
        state.items.push(product);
      }

      // Recalculate total
      state.total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    },

    removeItem: (state, action) => {
      const { productId, removeAll } = action.payload;
      const index = state.items.findIndex(item => item.productId === productId);

      if (index >= 0) {
        if (removeAll || state.items[index].quantity === 1) {
          state.items.splice(index, 1);
        } else {
          state.items[index].quantity -= 1;
        }
      }

      state.total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    },

    setCart: (state, action) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addItem, removeItem, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
