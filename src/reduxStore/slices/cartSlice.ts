import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      addItem: (state, action) => {
        // eslint-disable-next-line
        // @ts-ignore
        state.items.push(action.payload);
      },
      removeItem: (state, action) => {
         // eslint-disable-next-line
        // @ts-ignore
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      },
    },
  });
  
  export const { addItem, removeItem } = cartSlice.actions;
  
  export default cartSlice.reducer; 