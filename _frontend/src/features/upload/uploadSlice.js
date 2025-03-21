// src/features/upload/uploadSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isUploading: false,
  progress: 0,
  error: null,
  success: false
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    uploadStarted: (state) => {
      state.isUploading = true;
      state.progress = 0;
      state.error = null;
      state.success = false;
    },
    uploadProgress: (state, action) => {
      state.progress = action.payload;
    },
    uploadSuccess: (state) => {
      state.isUploading = false;
      state.progress = 100;
      state.success = true;
    },
    uploadFailed: (state, action) => {
      state.isUploading = false;
      state.error = action.payload;
    },
    uploadCancelled: (state) => {
      state.isUploading = false;
      state.progress = 0;
    },
    resetUpload: (state) => {
      return initialState;
    }
  }
});

export const {
  uploadStarted,
  uploadProgress,
  uploadSuccess,
  uploadFailed,
  uploadCancelled,
  resetUpload
} = uploadSlice.actions;

export default uploadSlice.reducer;