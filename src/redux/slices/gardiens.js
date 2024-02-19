import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getGardiens, _createGardien, _deleteGardien, _updateGardien } from "../../services/lib/gardien"

const initialState = []

export const createGardien = createAsyncThunk(
    "gardiens/create",
    async ({ dataToSubmit }) => (await _createGardien(dataToSubmit)).data
)

export const updateGardien = createAsyncThunk(
    "gardiens/update",
    async ({_id, dataToSubmit}) => (await _updateGardien(_id, dataToSubmit)).data
)

export const deleteGardien = createAsyncThunk(
    "gardiens/delete",
    async (_id) => (await _deleteGardien(_id)).data
)

export const findGardiens = createAsyncThunk(
    "gardiens/retrieve",
    async () => (await _getGardiens()).data
)

const gardienSlice = createSlice({
    name: 'gardien',
    initialState,
    extraReducers: {
        [createGardien.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateGardien.fulfilled] : (state, action) => {
            const index = state.findIndex(gardien => gardien._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteGardien.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findGardiens.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = gardienSlice;

export default reducer

