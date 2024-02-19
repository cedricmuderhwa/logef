import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getPrevenus, _createPrevenu, _deletePrevenu, _updatePrevenu } from "../../services/lib/prevenu"

const initialState = []

export const createPrevenu = createAsyncThunk(
    "prevenus/create",
    async ({ dataToSubmit }) => (await _createPrevenu(dataToSubmit)).data
)

export const updatePrevenu = createAsyncThunk(
    "prevenus/update",
    async ({_id, dataToSubmit}) => (await _updatePrevenu(_id, dataToSubmit)).data
)

export const deletePrevenu = createAsyncThunk(
    "prevenus/delete",
    async (_id) => (await _deletePrevenu(_id)).data
)

export const findPrevenus = createAsyncThunk(
    "prevenus/retrieve",
    async () => (await _getPrevenus()).data
)

const prevenuSlice = createSlice({
    name: 'prevenu',
    initialState,
    extraReducers: {
        [createPrevenu.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updatePrevenu.fulfilled] : (state, action) => {
            const index = state.findIndex(prevenu => prevenu._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deletePrevenu.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findPrevenus.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = prevenuSlice;

export default reducer

