import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getServices, _createService, _deleteService, _updateService } from "../../services/lib/service"

const initialState = []

export const createService = createAsyncThunk(
    "services/create",
    async ({ dataToSubmit }) => (await _createService(dataToSubmit)).data
)

export const updateService = createAsyncThunk(
    "services/update",
    async ({_id, dataToSubmit}) => (await _updateService(_id, dataToSubmit)).data
)

export const deleteService = createAsyncThunk(
    "services/delete",
    async (_id) => (await _deleteService(_id)).data
)

export const findServices = createAsyncThunk(
    "services/retrieve",
    async () => (await _getServices()).data
)

const serviceSlice = createSlice({
    name: 'service',
    initialState,
    extraReducers: {
        [createService.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateService.fulfilled] : (state, action) => {
            const index = state.findIndex(service => service._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteService.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findServices.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = serviceSlice;

export default reducer

