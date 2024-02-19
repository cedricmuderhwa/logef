import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getEscortes, _createEscorte, _deleteEscorte, _updateEscorte } from "../../services/lib/escorte"

const initialState = []

export const createEscorte = createAsyncThunk(
    "escortes/create",
    async ({ dataToSubmit }) => (await _createEscorte(dataToSubmit)).data
)

export const updateEscorte = createAsyncThunk(
    "escortes/update",
    async ({_id, dataToSubmit}) => (await _updateEscorte(_id, dataToSubmit)).data
)

export const deleteEscorte = createAsyncThunk(
    "escortes/delete",
    async (_id) => (await _deleteEscorte(_id)).data
)

export const findEscortes = createAsyncThunk(
    "escortes/retrieve",
    async () => (await _getEscortes()).data
)

const escorteSlice = createSlice({
    name: 'escorte',
    initialState,
    extraReducers: {
        [createEscorte.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateEscorte.fulfilled] : (state, action) => {
            const index = state.findIndex(escorte => escorte._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteEscorte.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findEscortes.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = escorteSlice;

export default reducer

