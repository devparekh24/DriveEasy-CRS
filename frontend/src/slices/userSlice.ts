import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface User {
    _id: string,
    name: string,
    email: string,
    image: string,
}

export interface UserState {
    users: User[]
}
const initialState: UserState = {
    users: []
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<{ data: User[] }>) => {
            state.users = action.payload.data;
        },
        addUser: (state, action: PayloadAction<{ data: User }>) => {
            state.users.push(action.payload.data);
        },
        updateUser: (state, action: PayloadAction<{ _id: string; updatedUser: Partial<User> }>) => {
            const { _id, updatedUser } = action.payload;
            const index = state.users.findIndex((user) => user._id === _id);
            if (index !== -1) {
                state.users[index] = { ...state.users[index], ...updatedUser };
            }
        },
        removeUser: (state, action: PayloadAction<string>) => {
            const userIdToRemove = action.payload;
            state.users = state.users.filter((user) => user._id !== userIdToRemove);
        },
    }
})

export const selectOrder = (state: RootState) => state.user
export const { setUsers, addUser, updateUser, removeUser } = userSlice.actions;
export default userSlice.reducer;