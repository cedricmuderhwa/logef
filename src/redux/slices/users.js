import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  _createUser,
  _getUsers,
  _resetUserAccount,
  _updateUser,
  _updateUserPermissions,
} from "../../services/lib/user";

const initialState = [];

export const createUser = createAsyncThunk(
  "users/create",
  async ({ dataToSubmit }) => (await _createUser(dataToSubmit)).data
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ _id, dataToSubmit }) => (await _updateUser(_id, dataToSubmit)).data
);

export const resetUserAccount = createAsyncThunk(
  "users/delete",
  async (_id) => (await _resetUserAccount(_id)).data
);

export const changeUserPermissions = createAsyncThunk(
  "users/change_permissions",
  async ({ _id, dataToSubmit }) =>
    (await _updateUserPermissions(_id, dataToSubmit)).data
);

export const findUsers = createAsyncThunk(
  "users/retrieve",
  async () => (await _getUsers()).data
);

const userSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: {
    [createUser.fulfilled]: (state, action) => {
      state.push(action.payload);
    },
    [updateUser.fulfilled]: (state, action) => {
      const index = state.findIndex((user) => user._id === action.payload._id);
      state[index] = {
        ...state[index],
        ...action.payload,
      };
    },
    [resetUserAccount.fulfilled]: (state, action) => {
      const index = state.findIndex((user) => user._id === action.payload._id);
      state[index] = {
        ...state[index],
        ...action.payload,
      };
    },
    [changeUserPermissions.fulfilled]: (state, action) => {
      const index = state.findIndex((user) => user._id === action.payload._id);
      state[index] = {
        ...state[index],
        ...action.payload,
      };
    },
    [findUsers.fulfilled]: (state, action) => {
      return [...action.payload];
    },
  },
});

const { reducer } = userSlice;

export default reducer;
