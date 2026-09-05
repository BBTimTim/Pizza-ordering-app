import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    products: [],
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
         setProducts(state, action) {
            state.products = action.payload
         },
         removeProduct(state, action) {
            state.products.filter(product => product.id == action.payload)
         },

          updateProduct(state, action) {
            const updatedItem = action.payload
            const update = state.products
            
         }
    },
})

export const {setProducts, removeProduct} = productSlice.actions;
export default productSlice.reducer
