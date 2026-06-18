import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { resumeApi } from '../../services/resumeApi';

const initialState = {
  uploadedResume: null,
  atsResult: null,
  optimizationResult: null,
  resumeHistory: [],
  versions: [],
  coverLetter: '',
  exportStatus: null,
  loading: false,
  error: null
};

export const uploadResume = createAsyncThunk('resume/uploadResume', async (formData, { rejectWithValue }) => {
  try {
    return await resumeApi.upload(formData);
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Resume upload failed.');
  }
});

export const fetchResumeHistory = createAsyncThunk('resume/fetchResumeHistory', async (_, { rejectWithValue }) => {
  try {
    return await resumeApi.history();
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to load resume history.');
  }
});

export const analyzeResume = createAsyncThunk('resume/analyzeResume', async (formData, { rejectWithValue }) => {
  try {
    return await resumeApi.analyze(formData);
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Analysis failed.');
  }
});

export const optimizeResume = createAsyncThunk('resume/optimizeResume', async (formData, { rejectWithValue }) => {
  try {
    return await resumeApi.optimize(formData);
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Optimization failed.');
  }
});

export const generateCoverLetter = createAsyncThunk('resume/generateCoverLetter', async (payload, { rejectWithValue }) => {
  try {
    return await resumeApi.coverLetter(payload);
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Cover letter generation failed.');
  }
});

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    clearResumeState(state) {
      state.uploadedResume = null;
      state.atsResult = null;
      state.optimizationResult = null;
      state.coverLetter = '';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedResume = action.payload?.data?.resume || null;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Resume upload failed.';
      })
      .addCase(fetchResumeHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.resumeHistory = action.payload?.data?.resumes || [];
        state.versions = action.payload?.data?.versions || [];
      })
      .addCase(fetchResumeHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load resume history.';
      })
      .addCase(analyzeResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.loading = false;
        state.atsResult = action.payload?.data?.analysis || null;
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Analysis failed.';
      })
      .addCase(optimizeResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(optimizeResume.fulfilled, (state, action) => {
        state.loading = false;
        state.optimizationResult = action.payload?.data?.optimized || null;
      })
      .addCase(optimizeResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Optimization failed.';
      })
      .addCase(generateCoverLetter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateCoverLetter.fulfilled, (state, action) => {
        state.loading = false;
        state.coverLetter = action.payload?.data?.coverLetter || '';
      })
      .addCase(generateCoverLetter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Cover letter generation failed.';
      });
  }
});

export const { clearResumeState } = resumeSlice.actions;
export default resumeSlice.reducer;
