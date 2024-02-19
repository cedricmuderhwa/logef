import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  _createFraud,
  _deleteFraud,
  _getFrauds,
  _updateFraud,
} from "../../services/lib/fraud_case";

const initialState = [];

export const createFraud = createAsyncThunk(
  "fraud_cases/create",
  async ({ dataToSubmit }) => (await _createFraud(dataToSubmit)).data
);

export const addFraud = createAsyncThunk(
  "fraud_cases/add",
  async (dataToSubmit) =>
    (
      await (() => {
        return new Promise((resolve) => resolve(dataToSubmit));
      })
    ).data
);

export const updateFraud = createAsyncThunk(
  "fraud_cases/update",
  async ({ _id, dataToSubmit }) => (await _updateFraud(_id, dataToSubmit)).data
);

export const uploadFile = createAsyncThunk(
  "fraud_cases/uploadfile",
  async (dataToSubmit) =>
    (
      await (() => {
        return new Promise((resolve) => resolve(dataToSubmit));
      })
    ).data
);

export const deleteFraud = createAsyncThunk(
  "fraud_cases/delete",
  async (_id) => (await _deleteFraud(_id)).data
);

export const findFrauds = createAsyncThunk(
  "fraud_cases/retrieve",
  async (dataToSubmit) => (await _getFrauds(dataToSubmit)).data
);

const fraud_caseSlice = createSlice({
  name: "fraud_case",
  initialState,
  extraReducers: {
    [createFraud.fulfilled]: (state, action) => {
      return [...action.payload.results];
    },
    [addFraud.fulfilled]: (state, action) => {
      return [...action.meta.arg.results];
    },
    [updateFraud.fulfilled]: (state, action) => {
      const index = state.findIndex(
        (fraud_case) => fraud_case._id === action.payload._id
      );
      state[index] = {
        ...state[index],
        ...action.payload,
      };
    },
    [uploadFile.fulfilled]: (state, action) => {
      const index = state.findIndex(
        (fraud_case) => fraud_case._id === action.meta.arg._id
      );
      state[index] = {
        ...state[index],
        ...action.payload,
      };
    },
    [deleteFraud.fulfilled]: (state, action) => {
      let index = state.findIndex(({ _id }) => _id === action.payload._id);
      state.splice(index, 1);
    },
    [findFrauds.fulfilled]: (state, action) => {
      return [...action.payload.results];
    },
  },
});

const { reducer } = fraud_caseSlice;

export default reducer;
