import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { profileApi } from '../../services/profileApi';

const initialState = {
  theme: localStorage.getItem('appTheme') || 'system',
  loading: false,
  error: null
};

export const updateTheme = createAsyncThunk('settings/updateTheme', async (payload, { rejectWithValue }) => {
  try {
    return await profileApi.theme(payload);
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Theme update failed.');
  }
});

export const updatePassword = createAsyncThunk('settings/updatePassword', async (payload, { rejectWithValue }) => {
  try {
    return await profileApi.password(payload);
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Password update failed.');
  }
});

export const logoutAccount = createAsyncThunk('settings/logoutAccount', async (_, { rejectWithValue }) => {
  try {
    return await profileApi.logout();
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Logout failed.');
  }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem('appTheme', action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.theme = action.payload?.data?.user?.theme || state.theme;
        localStorage.setItem('appTheme', state.theme);
      })
      .addCase(updateTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Theme update failed.';
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Password update failed.';
      })
      .addCase(logoutAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(logoutAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed.';
      });
  }
});

export const { setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
