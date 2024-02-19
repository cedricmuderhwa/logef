import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getContainers, _createContainer, _deleteContainer, _updateContainer } from "../../services/lib/container"

const initialState = []

export const createContainer = createAsyncThunk(
    "containers/create",
    async ({ dataToSubmit }) => (await _createContainer(dataToSubmit)).data
)

export const updateContainer = createAsyncThunk(
    "containers/update",
    async ({_id, dataToSubmit}) => (await _updateContainer(_id, dataToSubmit)).data
)

export const deleteContainer = createAsyncThunk(
    "containers/delete",
    async (_id) => (await _deleteContainer(_id)).data
)

export const findContainers = createAsyncThunk(
    "containers/retrieve",
    async () => (await _getContainers()).data
)

const containerSlice = createSlice({
    name: 'container',
    initialState,
    extraReducers: {
        [createContainer.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateContainer.fulfilled] : (state, action) => {
            const index = state.findIndex(container => container._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteContainer.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findContainers.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = containerSlice;

export default reducer

