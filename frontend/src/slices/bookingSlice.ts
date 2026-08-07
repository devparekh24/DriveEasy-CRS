import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './../store/store';

export interface BookingState {
    _id: string;
    car: string;
    user: string;
    fullName: string;
    emailAddress: string;
    phoneNo: string;
    pickupAddress: string;
    pickupDate: any;
    pickupTime: any;
    dropOffAddress: string;
    dropOffDate: any;
    dropOffTime: any;
    totalAmount: number;
}

export interface BookingStateCollection {
    bookings: BookingState[]
}
export const initialState: BookingStateCollection = {
    bookings: []
}

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setBookingData: (state, action: PayloadAction<{ data: BookingState[] }>) => {
            state.bookings = action.payload.data;
        },
    }
})


export const selectBooking = (state: RootState) => state.booking
export const { setBookingData } = bookingSlice.actions
export default bookingSlice.reducer;