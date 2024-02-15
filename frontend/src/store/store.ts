import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import authReducer from "../slices/authSlice";
import { authApi } from "../services/authApi";
import carReducer from "../slices/carSlice";
import { carApi } from "../services/carApi";
import addressReducer from "../slices/addressSlice";
import orderReducer from "../slices/orderSlice";
import { orderApi } from "../services/orderApi";
import bookingReducer from "../slices/bookingSlice";
import { bookingApi } from "../services/bookingApi";
import userReducer from "../slices/userSlice";
import { userApi } from "../services/userApi";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const persistConfig = {
//     key: 'root',
//     version: 1,
//     storage,
//     whitelist: ['auth'],
// }

// const persistedAuthReducer = persistReducer(persistConfig, authReducer);
// const persistedCarReducer = persistReducer(persistConfig, carReducer);
// const persistedAddressReducer = persistReducer(persistConfig, addressReducer);
// const persistedOrderReducer = persistReducer(persistConfig, orderReducer);
// const persistedBookingReducer = persistReducer(persistConfig, bookingReducer);
// const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        car: carReducer,
        [carApi.reducerPath]: carApi.reducer,
        address: addressReducer,
        order: orderReducer,
        [orderApi.reducerPath]: orderApi.reducer,
        booking: bookingReducer,
        [bookingApi.reducerPath]: bookingApi.reducer,
        user: userReducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(authApi.middleware, carApi.middleware, orderApi.middleware, bookingApi.middleware, userApi.middleware)
})

// const appReducer = combineReducers({
//     state: (state = {}) => state,
//     auth: authReducer,
// })

// const persistReducers = persistReducer(persistConfig, appReducer)
// const persistedAuthApi = persistReducer(persistConfig, authApi.reducer);

// export const store = configureStore({
//     reducer: {
//         [authApi.reducerPath]: persistedAuthApi,
//     },
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware({
//         serializableCheck: false,
//     }).concat(authApi.middleware),
// })

// export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch);