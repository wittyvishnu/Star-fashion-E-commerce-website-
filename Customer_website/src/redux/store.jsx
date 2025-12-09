import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feauters/authSlice"; // Import your reducers here
import { apiSlice } from "./services/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer:{
    [apiSlice.reducerPath]:apiSlice.reducer,
    auth:authReducer,
  },
  middleware: (getDefaultMiddlerware)=>
    getDefaultMiddlerware().concat(apiSlice.middleware),
  devTools:true
});

setupListeners(store.dispatch)