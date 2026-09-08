import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("items") || "[]"),
  totalQuantity: JSON.parse(localStorage.getItem("totalQuantity") || "0"),
  totalAmount: JSON.parse(localStorage.getItem("totalAmount") || "0"),
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
        const size = newItem.sizes.find((size) => size.id === Number(newItem.selectedSize));
        const sizePrice = newItem.price * (size?.price_multiplier || 1);

        const toppingsPrice = newItem.toppings.filter((topping) =>
               newItem.selectedToppings.includes(String(topping.id))
          ).reduce((sum, topping) => sum + topping.price, 0);

        const totalPrice = sizePrice + toppingsPrice;

        const existingItem = state.items.find((item) => {
            const sameProduct = item.id === newItem.id;
            const sameSize = item.selectedSize === newItem.selectedSize;
            const sameToppings =
              [...item.selectedToppings].sort().join(",") ===
              [...newItem.selectedToppings].sort().join(",");

            return sameProduct && sameSize && sameToppings;
        });

        if (!existingItem) {
          state.items.push({
            id: newItem.id,
            name: newItem.name,
            price: newItem.price,
            image: newItem.image,
            selectedSize: newItem.selectedSize,
            selectedToppings: newItem.selectedToppings || [],
            sizes: newItem.sizes,
            toppings: newItem.toppings,
            quantity: 1,
            totalPrice,

          });
        } else {
          existingItem.quantity++;
        }

      state.totalQuantity++;
      state.totalAmount = state.items.reduce((acc, item) => acc + item.totalPrice * item.quantity, 0);
      setItemsToLocalStorage(state);
    },

removeItemFromCart: (state, action) => {
    const itemToRemove = action.payload;
    
    const existingItem = state.items.find((item) => {
      const sameProduct = item.id === itemToRemove.id;
      const sameSize = item.selectedSize === itemToRemove.selectedSize;

      const sameToppings = 
        [...item.selectedToppings].sort().join(",") ===
        [...itemToRemove.selectedToppings].sort().join(",");

      return sameProduct && sameSize && sameToppings;
  });

  if (existingItem) {
    state.totalQuantity--;

    if (existingItem.quantity === 1) {
      state.items = state.items.filter((item) => item !== existingItem);
    } else {
      existingItem.quantity--;
    }
    state.totalAmount = state.items.reduce((acc, item) => acc + item.totalPrice * item.quantity, 0 );
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
