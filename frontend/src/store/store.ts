import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import authReducer from "../slices/authSlice";
import { authApi } from "../services/authApi";
import carReducer from "../slices/carSlice";
import { carApi } from "../services/carApi";
import addressReducer from "../slices/addressSlice";
import orderReducer from "../slices/orderSlice";
import { orderApi } from "../services/orderApi";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'root',
    storage,
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedCarReducer = persistReducer(persistConfig, carReducer);
const persistedAddressReducer = persistReducer(persistConfig, addressReducer);
const persistedOrderReducer = persistReducer(persistConfig, orderReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        [authApi.reducerPath]: authApi.reducer,
        car: persistedCarReducer,
        [carApi.reducerPath]: carApi.reducer,
        address: persistedAddressReducer,
        order: persistedOrderReducer,
        [orderApi.reducerPath]: orderApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, carApi.middleware, orderApi.middleware)
})

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch);