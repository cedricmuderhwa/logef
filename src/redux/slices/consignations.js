import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getConsignations, _createConsignation, _deleteConsignation, _updateConsignation } from "../../services/lib/consignation"

const initialState = []

export const createConsignation = createAsyncThunk(
    "consignations/create",
    async ({ dataToSubmit }) => (await _createConsignation(dataToSubmit)).data
)

export const updateConsignation = createAsyncThunk(
    "consignations/update",
    async ({_id, dataToSubmit}) => (await _updateConsignation(_id, dataToSubmit)).data
)

export const deleteConsignation = createAsyncThunk(
    "consignations/delete",
    async (_id) => (await _deleteConsignation(_id)).data
)

export const findConsignations = createAsyncThunk(
    "consignations/retrieve",
    async () => (await _getConsignations()).data
)

const consignationSlice = createSlice({
    name: 'consignation',
    initialState,
    extraReducers: {
        [createConsignation.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateConsignation.fulfilled] : (state, action) => {
            const index = state.findIndex(consignation => consignation._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteConsignation.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findConsignations.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = consignationSlice;

export default reducer

