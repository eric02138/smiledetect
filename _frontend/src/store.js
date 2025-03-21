// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import uploadReducer from './slices/uploadSlice';

export const store = configureStore({
  reducer: {
    upload: uploadReducer,
  },
});

// src/slices/uploadSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isUploading: false,
  progress: 0,
  error: null,
  uploadedFiles: [],
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    uploadStart: (state) => {
      state.isUploading = true;
      state.progress = 0;
      state.error = null;
    },
    uploadProgress: (state, action) => {
      state.progress = action.payload;
    },
    uploadSuccess: (state, action) => {
      state.isUploading = false;
      state.progress = 100;
      state.uploadedFiles.push(action.payload);
    },
    uploadError: (state, action) => {
      state.isUploading = false;
      state.error = action.payload;
    },
    uploadCancel: (state) => {
      state.isUploading = false;
      state.progress = 0;
    },
  },
});

export const {
  uploadStart,
  uploadProgress,
  uploadSuccess,
  uploadError,
  uploadCancel,
} = uploadSlice.actions;

export default uploadSlice.reducer;