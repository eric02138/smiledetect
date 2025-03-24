import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSaving: false,
  progress: 0,
  error: null,
  dbResponse: null
};

// For such a small app, breaking up the slices is a bit over-doing things.
const DbSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    dbStart: (state) => {
      state.isSaving = true;
      state.progress = 0;
      state.error = null;
    },
    dbProgress: (state, action) => {
      state.progress = action.payload;
    },
    dbSuccess: (state, action) => {
      state.isSaving = false;
      state.progress = 100;
      state.dbResponse = action.payload;
    },
    dbError: (state, action) => {
      state.isSaving = false;
      state.error = action.payload;
    },
    dbCancel: (state) => {
      state.isSaving = false;
      state.progress = 0;
    },
  },
});

export const {
  dbStart,
  dbProgress,
  dbSuccess,
  dbError,
  dbCancel,
} = DbSlice.actions;

export default DbSlice.reducer;