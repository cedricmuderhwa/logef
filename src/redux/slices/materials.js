import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getMaterials, _createMaterial, _deleteMaterial, _updateMaterial } from "../../services/lib/material"

const initialState = []

export const createMaterial = createAsyncThunk(
    "materials/create",
    async ({ dataToSubmit }) => (await _createMaterial(dataToSubmit)).data
)

export const updateMaterial = createAsyncThunk(
    "materials/update",
    async ({_id, dataToSubmit}) => (await _updateMaterial(_id, dataToSubmit)).data
)

export const deleteMaterial = createAsyncThunk(
    "materials/delete",
    async (_id) => (await _deleteMaterial(_id)).data
)

export const findMaterials = createAsyncThunk(
    "materials/retrieve",
    async () => (await _getMaterials()).data
)

const materialSlice = createSlice({
    name: 'material',
    initialState,
    extraReducers: {
        [createMaterial.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateMaterial.fulfilled] : (state, action) => {
            const index = state.findIndex(material => material._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteMaterial.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findMaterials.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = materialSlice;

export default reducer

