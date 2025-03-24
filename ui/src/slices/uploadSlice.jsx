import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isUploading: false,
  isSaving: false,
  progress: 0,
  error: null,
  smileData: null,
  dbResponse: null
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
      state.smileData = action.payload
    },
    uploadError: (state, action) => {
      state.isUploading = false;
      state.error = action.payload;
    },
    uploadCancel: (state) => {
      state.isUploading = false;
      state.progress = 0;
    },
    captureStart: (state) => {
      state.isCapturing = true;
      state.error = null;
    },
    captureCancel: (state) => {
      state.isCapturing = false;
    },
    captureSuccess: (state, action) => {
      state.smileData = action.payload;
    },
    captureError: (state, action) => {
      state.error = action.payload;
    },
    saveStart: (state) => {
      state.isSaving = true;
    },
    saveSuccess: (state, action) => {
      state.db_result = action.payload;
      state.isSaving = false;
    },
    saveError: (state, action) => {
      state.error = action.payload;
      state.isSaving = false;
    },
    saveCancel: (state) => {
      state.isSaving = false
    }

  },
});

export const {
  uploadStart,
  uploadProgress,
  uploadSuccess,
  uploadError,
  uploadCancel,
  captureStart,
  captureCancel,
  captureSuccess,
  captureError,
  saveStart,
  saveSuccess,
  saveError,
  saveCancel
} = uploadSlice.actions;

export default uploadSlice.reducer;