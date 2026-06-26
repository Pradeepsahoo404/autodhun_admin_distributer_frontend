import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '@/types';
import { TOKEN_STORAGE_KEY } from '@/constants';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  pendingEmail: string | null;
  pendingPurpose: string | null;
}

const getInitialToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const initialState: AuthState = {
  user: null,
  accessToken: getInitialToken(),
  isAuthenticated: Boolean(getInitialToken()),
  pendingEmail: null,
  pendingPurpose: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AuthUser; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.pendingEmail = null;
      state.pendingPurpose = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.accessToken);
      }
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, action.payload);
      }
    },
    setPendingOtp: (state, action: PayloadAction<{ email: string; purpose: string }>) => {
      state.pendingEmail = action.payload.email;
      state.pendingPurpose = action.payload.purpose;
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.pendingEmail = null;
      state.pendingPurpose = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    },
  },
});

export const { setCredentials, setAccessToken, setPendingOtp, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
