import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface Address {
    pickupAddress: string;
    dropoffAddress: string;
}

const initialState: Address = {
    pickupAddress: '',
    dropoffAddress: ''
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
        clearRoute: (state) => {
            state.pickupAddress = '';
            state.dropoffAddress = '';
        }
    }
})

export const selectAddress = (state: RootState) => state.address
export const { setPickupAddress, setDropoffAddress, clearRoute } = addressSlice.actions;
export default addressSlice.reducer;