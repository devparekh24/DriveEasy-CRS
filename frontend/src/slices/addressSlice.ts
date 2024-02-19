import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface Address {
    pickupAddress: string;
    dropoffAddress: string;
    totalKm: number;
}

const initialState: Address = {
    pickupAddress: '',
    dropoffAddress: '',
    totalKm: 0,
}

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setPickupAddress: (state, action: PayloadAction<{ pickupAddress: string }>) => {
            state.pickupAddress = action.payload.pickupAddress;
        },
        setDropoffAddress: (state, action: PayloadAction<{ dropoffAddress: string }>) => {
            state.dropoffAddress = action.payload.dropoffAddress;
        },
        setTotalKm: (state, action: PayloadAction<{ totalKm: number }>) => {
            state.totalKm = action.payload.totalKm;
        },
        clearRoute: (state) => {
            state.pickupAddress = '';
            state.dropoffAddress = '';
            state.totalKm = 0;
        }
    }
})

export const selectAddress = (state: RootState) => state.address
export const { setPickupAddress, setDropoffAddress, setTotalKm, clearRoute } = addressSlice.actions;
export default addressSlice.reducer;