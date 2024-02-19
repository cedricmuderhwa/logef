import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getRegions, _createRegion, _deleteRegion, _updateRegion } from "../../services/lib/region"

const initialState = []

export const createRegion = createAsyncThunk(
    "regions/create",
    async ({ dataToSubmit }) => (await _createRegion(dataToSubmit)).data
)

export const updateRegion = createAsyncThunk(
    "regions/update",
    async ({_id, dataToSubmit}) => (await _updateRegion(_id, dataToSubmit)).data
)

export const deleteRegion = createAsyncThunk(
    "regions/delete",
    async (_id) => (await _deleteRegion(_id)).data
)

export const findRegions = createAsyncThunk(
    "regions/retrieve",
    async () => (await _getRegions()).data
)

const regionSlice = createSlice({
    name: 'region',
    initialState,
    extraReducers: {
        [createRegion.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateRegion.fulfilled] : (state, action) => {
            const index = state.findIndex(region => region._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteRegion.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findRegions.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = regionSlice;

export default reducer

