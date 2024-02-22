import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface Order {
    _id: string;
    user: string;
    car: string;
    fullName: string;
    emailAddress: string;
    phoneNo: string;
    pickupAddress: string;
    pickupDateAndTime: Date | string;
    dropOffAddress: string;
    dropOffDateAndTime: Date | string;
    totalAmount: number;
    totalKm: number;
}

export interface OrderState {
    orders: Order[]
}
const initialState: OrderState = {
    orders: []
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<{ data: Order[] }>) => {
            state.orders = action.payload.data;
        },
        addOrder: (state, action: PayloadAction<{ data: Order }>) => {
            state.orders.push(action.payload.data);
        },
        updateOrder: (state, action: PayloadAction<{ _id: string; updatedOrder: Partial<Order> }>) => {
            const { _id, updatedOrder } = action.payload;
            const index = state.orders.findIndex((order) => order._id === _id);
            if (index !== -1) {
                state.orders[index] = { ...state.orders[index], ...updatedOrder };
            }
        },
        removeOrder: (state, action: PayloadAction<string>) => {
            const orderIdToRemove = action.payload;
            state.orders = state.orders.filter((order) => order._id !== orderIdToRemove);
        },
    }
})

export const selectOrder = (state: RootState) => state.order
export const { setOrders, addOrder, updateOrder, removeOrder } = orderSlice.actions;
export default orderSlice.reducer;