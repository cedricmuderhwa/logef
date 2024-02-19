import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getUnits, _createUnit, _deleteUnit, _updateUnit } from "../../services/lib/unit"

const initialState = []

export const createUnit = createAsyncThunk(
    "units/create",
    async ({ dataToSubmit }) => (await _createUnit(dataToSubmit)).data
)

export const updateUnit = createAsyncThunk(
    "units/update",
    async ({_id, dataToSubmit}) => (await _updateUnit(_id, dataToSubmit)).data
)

export const deleteUnit = createAsyncThunk(
    "units/delete",
    async (_id) => (await _deleteUnit(_id)).data
)

export const findUnits = createAsyncThunk(
    "units/retrieve",
    async () => (await _getUnits()).data
)

const unitSlice = createSlice({
    name: 'unit',
    initialState,
    extraReducers: {
        [createUnit.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateUnit.fulfilled] : (state, action) => {
            const index = state.findIndex(unit => unit._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteUnit.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findUnits.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = unitSlice;

export default reducer

