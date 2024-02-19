import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  _createAgent,
  _deleteAgent,
  _getAgents,
  _updateAgent,
} from "../../services/lib/agent";

const initialState = [];

export const createAgent = createAsyncThunk(
  "agents/create",
  async ({ dataToSubmit }) => (await _createAgent(dataToSubmit)).data
);

export const updateAgent = createAsyncThunk(
  "agents/update",
  async ({ _id, dataToSubmit }) => (await _updateAgent(_id, dataToSubmit)).data
);

export const deleteAgent = createAsyncThunk(
  "agents/delete",
  async (_id) => (await _deleteAgent(_id)).data
);

export const findAgents = createAsyncThunk(
  "agents/retrieve",
  async (controller) => (await _getAgents(controller)).data
);

const agentSlice = createSlice({
  name: "agent",
  initialState,
  extraReducers: {
    [createAgent.fulfilled]: (state, action) => {
      state.push(action.payload);
    },
    [updateAgent.fulfilled]: (state, action) => {
      const index = state.findIndex(
        (agent) => agent._id === action.payload._id
      );
      state[index] = {
        ...state[index],
        ...action.payload,
      };
    },
    [deleteAgent.fulfilled]: (state, action) => {
      let index = state.findIndex(({ _id }) => _id === action.payload._id);
      state.splice(index, 1);
    },
    [findAgents.fulfilled]: (state, action) => {
      return [...action.payload];
    },
  },
});

const { reducer } = agentSlice;

export default reducer;
