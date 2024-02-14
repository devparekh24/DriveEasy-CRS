import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './../store/store';

export interface BookingState {
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

export const initialState: BookingState = {
    fullName: '',
    emailAddress: '',
    phoneNo: '',
    pickupAddress: '',
    pickupDate: '',
    pickupTime: '',
    dropOffAddress: '',
    dropOffDate: '',
    dropOffTime: '',
    totalAmount: 0,
}

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {} as BookingState,
    reducers: {
        setBookingData: (state, action: PayloadAction<BookingState>) => {
            state.fullName = action.payload.fullName!
            state.emailAddress = action.payload.emailAddress!
            state.phoneNo = action.payload.phoneNo!
            state.pickupAddress = action.payload.pickupAddress!
            state.pickupDate = action.payload.pickupDate!
            state.pickupTime = action.payload.pickupTime!
            state.dropOffAddress = action.payload.dropOffAddress!
            state.dropOffDate = action.payload.dropOffDate!
            state.dropOffTime = action.payload.dropOffTime!
            state.totalAmount = action.payload.totalAmount!
        },
    }
})


export const selectBooking = (state: RootState) => state.booking
export const { setBookingData } = bookingSlice.actions
export default bookingSlice.reducer;