import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import authReducer from "../slices/authSlice";
import { authApi } from "../services/authApi";
import carReducer from "../slices/carSlice";
import { carApi } from "../services/carApi";
import addressReducer from "../slices/addressSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        car: carReducer,
        [carApi.reducerPath]: carApi.reducer,
        address: addressReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, carApi.middleware)
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch);