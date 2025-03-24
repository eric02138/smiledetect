import { configureStore } from '@reduxjs/toolkit';
import uploadReducer from './slices/uploadSlice';

export const store = configureStore({
  reducer: {
    upload: uploadReducer
  },
});