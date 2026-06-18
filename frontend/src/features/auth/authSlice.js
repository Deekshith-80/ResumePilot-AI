import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../services/authApi';

const getAuthErrorMessage = (error, fallback) => {
  const responseData = error?.response?.data;

  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }

        const field = item?.field ? `${item.field}: ` : '';
        return `${field}${item?.message || 'Invalid value.'}`;
      })
      .join(' ');
  }

  return responseData?.message || fallback;
};

const initialState = {
  user: null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: false,
  loading: false,
  error: null,
  sessionChecked: false
};

export const registerUser = createAsyncThunk('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    return await authApi.register(payload);
  } catch (error) {
    return rejectWithValue(getAuthErrorMessage(error, 'Registration failed.'));
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (payload, { rejectWithValue }) => {
  try {
    return await authApi.login(payload);
  } catch (error) {
    return rejectWithValue(getAuthErrorMessage(error, 'Login failed.'));
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    return await authApi.me();
  } catch (error) {
    return rejectWithValue({
      status: error?.response?.status,
      message: error?.response?.data?.message || 'Failed to load current user.'
    });
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    return await authApi.logout();
  } catch (error) {
    return rejectWithValue(getAuthErrorMessage(error, 'Logout failed.'));
  }
});

const persistSession = (state, payload) => {
  state.user = payload?.data?.user || null;
  state.token = payload?.data?.token || localStorage.getItem('authToken');
  state.isAuthenticated = Boolean(state.user || state.token);
  state.error = null;
  state.sessionChecked = true;
  if (state.token) {
    localStorage.setItem('authToken', state.token);
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('authToken');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        persistSession(state, action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed.';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        persistSession(state, action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed.';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload?.data?.user || null;
        state.isAuthenticated = Boolean(state.user || state.token);
        state.sessionChecked = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        const status = action.payload?.status;

        state.user = null;
        state.sessionChecked = true;
        state.error = action.payload?.message || state.error;

        if (status === 401) {
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('authToken');
          return;
        }

        state.token = localStorage.getItem('authToken') || null;
        state.isAuthenticated = Boolean(state.token);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.sessionChecked = false;
        localStorage.removeItem('authToken');
      });
  }
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
