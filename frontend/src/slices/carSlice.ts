import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface Car {
    _id: string;
    carName: string;
    carType: string;
    companyName: string;
    mileage: number;
    year: string;
    capacity: number;
    color: string;
    availability: boolean;
    rentPrice: number;
    image: string;
    fule: string;
}

export interface CarState {
    cars: Car[]
}
const initialState: CarState = {
    cars: []
}
const carSlice = createSlice({
    name: 'car',
    initialState,
    reducers: {
        setCars: (state, action: PayloadAction<Car[]>) => {
            state.cars = action.payload;
        },
        addCar: (state, action: PayloadAction<Car>) => {
            state.cars.push(action.payload);
        },
        updateCar: (state, action: PayloadAction<{ _id: string; updatedCar: Partial<Car> }>) => {
            const { _id, updatedCar } = action.payload;
            const index = state.cars.findIndex((car) => car._id === _id);
            if (index !== -1) {
                state.cars[index] = { ...state.cars[index], ...updatedCar };
            }
        },
        removeCar: (state, action: PayloadAction<string>) => {
            const carIdToRemove = action.payload;
            state.cars = state.cars.filter((car) => car._id !== carIdToRemove);
        },
    }
})

export const selectCar = (state: RootState) => state.car
export const { setCars, addCar, removeCar, updateCar } = carSlice.actions;
export default carSlice.reducer;