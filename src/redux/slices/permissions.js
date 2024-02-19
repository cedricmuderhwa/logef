import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  _createPermission,
  _getPermissions,
  _updatePermission,
} from "../../services/lib/permission";

const initialState = [];

export const createPermission = createAsyncThunk(
  "permissions/create",
  async ({ dataToSubmit }) => (await _createPermission(dataToSubmit)).data
);

export const updatePermission = createAsyncThunk(
  "permissions/update",
  async ({ _id, dataToSubmit }) =>
    (await _updatePermission(_id, dataToSubmit)).data
);

export const findPermissions = createAsyncThunk(
  "permissions/retrieve",
  async () => (await _getPermissions()).data
);

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  extraReducers: {
    [createPermission.fulfilled]: (state, action) => {
      state.push(action.payload);
    },
    [updatePermission.fulfilled]: (state, action) => {
      const index = state.findIndex(
        (permission) => permission._id === action.payload._id
      );
      state[index] = {
        ...state[index],
        ...action.payload,
      };
    },
    [findPermissions.fulfilled]: (state, action) => {
      return [...action.payload];
    },
  },
});

const { reducer } = permissionSlice;

export default reducer;
