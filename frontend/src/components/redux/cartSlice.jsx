import { createSlice } from "@reduxjs/toolkit";

const items = localStorage.getItem('items')
? JSON.parse(localStorage.getItem('items'))
: [];

const totalAmount = localStorage.getItem('totalAmount')
? JSON.parse(localStorage.getItem('totalAmount'))
: 0;

const totalQuantity = localStorage.getItem('totalQuantity')
? JSON.parse(localStorage.getItem('totalQuantity'))
: 0;

const initialState = {
  items,
  totalQuantity,
  totalAmount,
};

const setItemsToLocalStorage = (state) => {
       localStorage.setItem("items", JSON.stringify(state.items));
       localStorage.setItem("totalQuantity",JSON.stringify(state.totalQuantity),);
       localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity;
      state.totalAmount = action.payload.totalAmount;

      setItemsToLocalStorage(state);
    },

     addItemToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      state.totalQuantity++;
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
      
      state.totalAmount = state.items.reduce((acc, item) => acc + item.totalPrice, 0);
       setItemsToLocalStorage(state);
    },

      removeItemFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        state.totalQuantity--;
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
        }
        state.totalAmount = state.items.reduce((acc, item) => acc + item.totalPrice, 0);
      }
      setItemsToLocalStorage(state);
    },

     clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;

      localStorage.removeItem("items");
      localStorage.removeItem("totalQuantity");
      localStorage.removeItem("totalAmount");
    },
     
  },
});

export const { addItemToCart, removeItemFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
