import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface ContactQuery {
  _id: string;
  name: string;
  email: string;
  contactNo: string;
  message: string;
  meeting: string;
}

export interface ContactQueryState {
  contactQueries: ContactQuery[];
}
const initialState: ContactQueryState = {
  contactQueries: [],
};
const contactQuerySlice = createSlice({
  name: "contactQuery",
  initialState,
  reducers: {
    setContactQueries: (state, action: PayloadAction<{ data: ContactQuery[] }>) => {
      state.contactQueries = action.payload.data;
    },
    addContactQuery: (state, action: PayloadAction<ContactQuery>) => {
      state.contactQueries.push(action.payload);
    },
    updateContactQuery: (state, action: PayloadAction<{ _id: string; updatedContactQuery: Partial<ContactQuery> }>) => {
      const { _id, updatedContactQuery } = action.payload;
      const index = state.contactQueries.findIndex((cq) => cq._id === _id);
      if (index !== -1) {
        state.contactQueries[index] = { ...state.contactQueries[index], ...updatedContactQuery };
      }
    },
    removeContactQuery: (state, action: PayloadAction<string>) => {
      const cqIdToRemove = action.payload;
      state.contactQueries = state.contactQueries.filter((cq) => cq._id !== cqIdToRemove);
    },
  },
});

export const selectContactQuery = (state: RootState) => state.contactQuery;
export const { setContactQueries, addContactQuery, removeContactQuery, updateContactQuery } = contactQuerySlice.actions;
export default contactQuerySlice.reducer;
