import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  prediction: [],
  loading: false,
  error: null,
};

const predctionSlice = createSlice({
  name: "predict",
  initialState,
  reducers: {
    prediction_start: function (state, action) {
      state.loading = true;
    },
    prediction_success: function (state, action) {
      state.loading = false;
      state.prediction = action.payload;
    },
    prediction_failure: function (state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { prediction_start, prediction_success, prediction_failure } =
  predctionSlice.actions;

export default predctionSlice.reducer;
