// src/features/upload/uploadSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isUploading: false,
  progress: 0,
  error: null,
  success: false
};

const myTimer = setInterval(() => {
    if (state.progress === 100) {
      return 0;
    }
    const diff = Math.random() * 10;
    return Math.min(state.progress + diff, 100);
}, 500);

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
    uploadProgresss: (state) => {
      state.progress = myTimer
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
  uploadProgresss,
  uploadSuccess,
  uploadFailed,
  uploadCancelled,
  resetUpload
} = uploadSlice.actions;

export default uploadSlice.reducer;