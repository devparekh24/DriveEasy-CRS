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
// Restore auth state from localStorage on app load
const loadAuthFromStorage = (): AuthState => {
    try {
        const storedUser = localStorage.getItem('user');
        const isLogin = localStorage.getItem('isLogin');
        if (storedUser && isLogin === 'true') {
            const parsed = JSON.parse(storedUser);
            return {
                name: parsed.name || null,
                token: parsed.token || null,
                user: parsed.user || null,
                userId: parsed.userId || null,
                isLoggedIn: true,
                isAdmin: parsed.role === 'admin',
            };
        }
    } catch {
        // If localStorage is corrupted, fall back to defaults
    }
    return {
        name: null,
        token: null,
        user: null,
        userId: null,
        isLoggedIn: false,
        isAdmin: false,
    };
};

const initialState: AuthState = loadAuthFromStorage();
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserLogin(state, action: PayloadAction<{ name: string, token: string, role: string, userId: string, user: User }>) {
            localStorage.setItem('user', JSON.stringify({
                name: action.payload.name,
                token: action.payload.token,
                role: action.payload.role,
                userId: action.payload.userId,
                user: action.payload.user
            }))
            state.name = action.payload.name;
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.user = action.payload.user;
            state.isLoggedIn = true;
            localStorage.setItem('isLogin', state.isLoggedIn.toString())
            if (action.payload.role === 'admin') {
                state.isAdmin = true;
            }
        },
        setUserSignup(state, action: PayloadAction<{ name: string, email: string, password: string, confirmPassword: string, contactNumber: number, user: User }>) {
            state.user = action.payload.user;
        },
        logout(state) {
            localStorage.removeItem('user');
            localStorage.removeItem('isLogin');
            state.name = null;
            state.token = null;
            state.user = null;
            state.isLoggedIn = false;
            state.isAdmin = false;
            state.userId = null;
        }
    }
})

export const selectAuth = (state: RootState) => state.auth
export const { setUserLogin, setUserSignup, logout } = authSlice.actions;
export default authSlice.reducer;