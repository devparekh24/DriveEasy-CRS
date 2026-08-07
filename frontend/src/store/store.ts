import { configureStore, combineReducers } from "@reduxjs/toolkit";
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
import contactQueryReducer from "../slices/contactQuerySlice";
import { contactQueryApi } from "../services/contactQueryApi";
import damageReportReducer from "../slices/damageReportSlice";
import { damageReportApi } from "../services/damageReportApi";

const appReducer = combineReducers({
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
    contactQuery: contactQueryReducer,
    [contactQueryApi.reducerPath]: contactQueryApi.reducer,
    damageReport: damageReportReducer,
    [damageReportApi.reducerPath]: damageReportApi.reducer,
});

const rootReducer = (state: any, action: any) => {
    if (action.type === 'auth/logout' || action.type === 'auth/setUserLogin') {
        // Reset all RTK Query API caches and slice states when switching users or logging out
        state = undefined;
    }
    return appReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(
            authApi.middleware,
            carApi.middleware,
            orderApi.middleware,
            bookingApi.middleware,
            userApi.middleware,
            contactQueryApi.middleware,
            damageReportApi.middleware
        )
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof appReducer>;
setupListeners(store.dispatch);