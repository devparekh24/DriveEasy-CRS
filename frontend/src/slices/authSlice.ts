import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface User {
    createdAt: string;
    email: string;
    id: string;
    name: string;
    passwordResetExpires: string;
    passwordResetToken: string;
    role: string;
    updatedAt: string;
    image: string;
    __v: number;
}

export interface AuthState {
    name: string | null;
    token: string | null;
    user: User | null;
    userId: string | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
}
const initialState: AuthState = {
    name: null,
    token: null,
    user: null,
    userId: null,
    isLoggedIn: false,
    isAdmin: false
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserLogin(state, action: PayloadAction<{ name: string, token: string, role: string, userId: string, user: User }>) {
            localStorage.setItem('user', JSON.stringify({
                name: action.payload.name,
                token: action.payload.token,
                role: action.payload.role,
                userId: action.payload.userId
            }))
            state.name = action.payload.name;
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.user = action.payload.user;
            state.isLoggedIn = true;
            if (action.payload.role === 'admin') {
                state.isAdmin = true;
            }
        },
        setUserSignup(state, action: PayloadAction<{ name: string, email: string, password: string, confirmPassword: string, user: User }>) {
            state.user = action.payload.user;
        },
        logout(state) {
            localStorage.removeItem('user');
            state.name = null;
            state.token = null;
            // state.user = null;
            state.isLoggedIn = false;
            state.isAdmin = false;
        }
    }
})

export const selectAuth = (state: RootState) => state.auth
export const { setUserLogin, setUserSignup, logout } = authSlice.actions;
export default authSlice.reducer;