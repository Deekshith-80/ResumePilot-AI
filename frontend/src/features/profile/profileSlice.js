import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { profileApi } from '../../services/profileApi';

const initialState = {
  profile: null,
  stats: null,
  resumeHistory: [],
  applicationHistory: [],
  loading: false,
  error: null
};

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    return await profileApi.get();
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to load profile.');
  }
});

export const fetchProfileStats = createAsyncThunk('profile/fetchProfileStats', async (_, { rejectWithValue }) => {
  try {
    return await profileApi.stats();
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to load stats.');
  }
});

export const updateProfile = createAsyncThunk('profile/updateProfile', async (formData, { rejectWithValue }) => {
  try {
    return await profileApi.update(formData);
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Profile update failed.');
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data?.profile || null;
        state.resumeHistory = action.payload?.data?.resumeHistory || [];
        state.applicationHistory = action.payload?.data?.applicationHistory || [];
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load profile.';
      })
      .addCase(fetchProfileStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload?.data?.stats || null;
      })
      .addCase(fetchProfileStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load stats.';
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data?.user ? { ...state.profile, ...action.payload.data.user } : state.profile;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Profile update failed.';
      });
  }
});

export default profileSlice.reducer;
