import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  profileImage?: string;
  birthDate?: string;
  gender?: string;
  isAdmin?: number;
}

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
    
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload);
      }
    },
    
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Actions
export const {
  setUser,
  setToken,
  login,
  logout,
  updateUser,
  setLoading,
  setError,
} = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectToken = (state: { user: UserState }) => state.user.token;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;

// Memoized selectors
export const selectIsAuthenticated = createSelector(
  [selectUser, selectToken],
  (user, token) => !!(user && token)
);

export const selectUserName = createSelector(
  [selectUser],
  (user) => (user && 'name' in user ? (user as any).name : '')
);

export const selectUserEmail = createSelector(
  [selectUser],
  (user) => user?.email || ''
);

export default userSlice.reducer; 