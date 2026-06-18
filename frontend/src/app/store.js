import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import resumeReducer from '../features/resume/resumeSlice';
import jobReducer from '../features/jobs/jobSlice';
import profileReducer from '../features/profile/profileSlice';
import settingsReducer from '../features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    jobs: jobReducer,
    profile: profileReducer,
    settings: settingsReducer
  }
});

