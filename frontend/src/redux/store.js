import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features_Slice_Reducer/auth/authSlice";
import productSlice from "./features_Slice_Reducer/product/productSlice";
import filterSlice from "./features_Slice_Reducer/product/filterSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
    filter: filterSlice
  },
  devTools: true
});
