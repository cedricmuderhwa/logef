import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { _getLogs } from "../../services/lib/log";

const initialState = [];

export const findLogs = createAsyncThunk(
  "logs/retrieve",
  async () => (await _getLogs()).data
);

const logSlice = createSlice({
  name: "log",
  initialState,
  extraReducers: {
    [findLogs.fulfilled]: (state, action) => {
      return [...action.payload];
    },
  },
});

const { reducer } = logSlice;

export default reducer;
