import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getProvenances, _createProvenance, _deleteProvenance, _updateProvenance } from "../../services/lib/provenance"

const initialState = []

export const createProvenance = createAsyncThunk(
    "provenances/create",
    async ({ dataToSubmit }) => (await _createProvenance(dataToSubmit)).data
)

export const updateProvenance = createAsyncThunk(
    "provenances/update",
    async ({_id, dataToSubmit}) => (await _updateProvenance(_id, dataToSubmit)).data
)

export const deleteProvenance = createAsyncThunk(
    "provenances/delete",
    async (_id) => (await _deleteProvenance(_id)).data
)

export const findProvenances = createAsyncThunk(
    "provenances/retrieve",
    async () => (await _getProvenances()).data
)

const provenanceSlice = createSlice({
    name: 'provenance',
    initialState,
    extraReducers: {
        [createProvenance.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateProvenance.fulfilled] : (state, action) => {
            const index = state.findIndex(provenance => provenance._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteProvenance.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findProvenances.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = provenanceSlice;

export default reducer

