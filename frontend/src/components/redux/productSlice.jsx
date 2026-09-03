import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    products: [],
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
         setProducts(state, action) {
            state.products = action.payload.products
         }
    },
})

export const {setProducts} = productSlice.actions;
export default productSlice.reducer


