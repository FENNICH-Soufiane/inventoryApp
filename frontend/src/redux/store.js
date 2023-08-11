import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features_Slice_Reducer/auth/authSlice";
import productSlice from "./features_Slice_Reducer/product/productSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice
  },
  devTools: true
});
