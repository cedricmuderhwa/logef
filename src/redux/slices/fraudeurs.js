import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getFraudeurs, _createFraudeur, _deleteFraudeur, _updateFraudeur } from "../../services/lib/fraudeur"

const initialState = []

export const createFraudeur = createAsyncThunk(
    "fraudeurs/create",
    async ({ dataToSubmit }) => (await _createFraudeur(dataToSubmit)).data
)

export const updateFraudeur = createAsyncThunk(
    "fraudeurs/update",
    async ({_id, dataToSubmit}) => (await _updateFraudeur(_id, dataToSubmit)).data
)

export const deleteFraudeur = createAsyncThunk(
    "fraudeurs/delete",
    async (_id) => (await _deleteFraudeur(_id)).data
)

export const findFraudeurs = createAsyncThunk(
    "fraudeurs/retrieve",
    async () => (await _getFraudeurs()).data
)

const fraudeurSlice = createSlice({
    name: 'fraudeur',
    initialState,
    extraReducers: {
        [createFraudeur.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updateFraudeur.fulfilled] : (state, action) => {
            const index = state.findIndex(fraudeur => fraudeur._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deleteFraudeur.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findFraudeurs.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = fraudeurSlice;

export default reducer

