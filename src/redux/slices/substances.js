import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getSubstances, _createSubstance, _deleteSubstance, _updateSubstance } from "../../services/lib/substance"

const initialState = []

export const createSubstance = createAsyncThunk(
    "substances/create",
    async ({ dataToSubmit }) => (await _createSubstance(dataToSubmit)).data
)

export const updateSubstance = createAsyncThunk(
    "substances/update",
    async ({_id, dataToSubmit}) => (await _updateSubstance(_id, dataToSubmit)).data
)

export const deleteSubstance = createAsyncThunk(
    "substances/delete",
    async (_id) => (await _deleteSubstance(_id)).data
)

export const findSubstances = createAsyncThunk(
    "substances/retrieve",
    async () => (await _getSubstances()).data
)

const substanceSlice = createSlice({
    name: 'substance',
    initialState,
    extraReducers: {
        [createSubstance.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateSubstance.fulfilled] : (state, action) => {
            const index = state.findIndex(substance => substance._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteSubstance.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findSubstances.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = substanceSlice;

export default reducer

