import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { jobApi } from '../../services/jobApi';

const initialState = {
  jobs: [],
  matchedJobs: [],
  applications: [],
  latestResume: null,
  loading: false,
  error: null
};

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (params, { rejectWithValue }) => {
  try {
    return await jobApi.jobs(params);
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to load jobs.');
  }
});

export const fetchJobMatches = createAsyncThunk('jobs/fetchJobMatches', async (_, { rejectWithValue }) => {
  try {
    return await jobApi.matches();
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to load matches.');
  }
});

export const applyToJob = createAsyncThunk('jobs/applyToJob', async (payload, { rejectWithValue }) => {
  try {
    return await jobApi.apply(payload);
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Application failed.');
  }
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload?.data?.jobs || [];
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load jobs.';
      })
      .addCase(fetchJobMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matchedJobs = action.payload?.data?.matches || [];
        state.applications = action.payload?.data?.recentApplications || [];
        state.latestResume = action.payload?.data?.latestResume || null;
      })
      .addCase(fetchJobMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load matches.';
      })
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Application failed.';
      });
  }
});

export default jobSlice.reducer;
