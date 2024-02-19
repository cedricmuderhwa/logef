import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getSelectedFraud } from "../../services/lib/fraud_case"

const initialState = {}

export const findSelected = createAsyncThunk(
    "currents/retrieve",
    async (id) => (await _getSelectedFraud(id)).data
)

const currentSlice = createSlice({
    name: 'current',
    initialState,
    extraReducers: {
        [findSelected.fulfilled] : (state, action) => {
            return { ...state, ...action.payload }
        },

    }
})

const { reducer } = currentSlice;

export default reducer
