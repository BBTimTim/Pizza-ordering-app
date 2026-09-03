import { createSlice } from "@reduxjs/toolkit";

const products = localStorage.getItem('products')
? JSON.parse(localStorage.getItem('products'))
: [];

const totalPrice = localStorage.getItem('totalPrice')
? JSON.parse(localStorage.getItem('totalPrice'))
: 0;

const totalQuantity = localStorage.getItem('totalQuantity')
? JSON.parse(localStorage.getItem('totalQuantity'))
: 0;

const initialState = {
  products,
  totalQuantity,
  totalPrice,
};

const setItemsToLocalStorage = (state) => {
       localStorage.setItem("products", JSON.stringify(state.products));
       localStorage.setItem("totalQuantity",JSON.stringify(state.totalQuantity),);
       localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.products = action.payload.products;
      state.totalQuantity = action.payload.totalQuantity;
      state.totalPrice = action.payload.totalPrice;

      setItemsToLocalStorage(state);
    },
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.products.find(
        (item) => item.id === newItem.id,
      );

      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      } else {
        state.products.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          image: newItem.image,
        });
      }

      state.totalPrice += newItem.price;
      state.totalQuantity++;

      setItemsToLocalStorage(state);
    },
  },
});

export const { addToCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
