import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface DamageReport {
    _id: string;
    user: string;
    car: string;
    location: string;
    description: string;
    isDamageRepaired: boolean;
}

export interface DamageReportState {
    damageReports: DamageReport[];
}
const initialState: DamageReportState = {
    damageReports: [],
};
const damageReportSlice = createSlice({
    name: "damageReport",
    initialState,
    reducers: {
        setDamageReports: (state, action: PayloadAction<{ data: DamageReport[] }>) => {
            state.damageReports = action.payload.data;
        },
        addDamageReport: (state, action: PayloadAction<DamageReport>) => {
            state.damageReports.push(action.payload);
        },
        updateDamageReport: (state, action: PayloadAction<{ _id: string; updatedDamageReport: Partial<DamageReport> }>) => {
            const { _id, updatedDamageReport } = action.payload;
            const index = state.damageReports.findIndex((dr) => dr._id === _id);
            if (index !== -1) {
                state.damageReports[index] = { ...state.damageReports[index], ...updatedDamageReport };
            }
        },
        removeDamageReport: (state, action: PayloadAction<string>) => {
            const drIdToRemove = action.payload;
            state.damageReports = state.damageReports.filter((dr) => dr._id !== drIdToRemove);
        },
    },
});

export const selectDamageReport = (state: RootState) => state.damageReport;
export const { setDamageReports, addDamageReport, removeDamageReport, updateDamageReport } = damageReportSlice.actions;
export default damageReportSlice.reducer;
