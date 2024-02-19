import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { _getPvs, _createPv, _deletePv, _updatePv } from "../../services/lib/pvs"

const initialState = []

export const createPv = createAsyncThunk(
    "pvs/create",
    async ({ dataToSubmit }) => (await _createPv(dataToSubmit)).data
)

export const updatePv = createAsyncThunk(
    "pvs/update",
    async ({_id, dataToSubmit}) => (await _updatePv(_id, dataToSubmit)).data
)

export const deletePv = createAsyncThunk(
    "pvs/delete",
    async (_id) => (await _deletePv(_id)).data
)

export const findPvs = createAsyncThunk(
    "pvs/retrieve",
    async () => (await _getPvs()).data
)

const pvSlice = createSlice({
    name: 'pv',
    initialState,
    extraReducers: {
        [createPv.fulfilled] : (state, action) => {
            state.push(action.payload)
        },
        [updatePv.fulfilled] : (state, action) => {
            const index = state.findIndex(pv => pv._id === action.payload._id)
            state[index] = {
                ...state[index], ...action.payload
            }
        },
        [deletePv.fulfilled] : (state, action) => {
            let index = state.findIndex(({ _id }) => _id === action.payload._id);
            state.splice(index, 1);
        },
        [findPvs.fulfilled] : (state, action) => {
            return [...action.payload]
        },

    }
})

const { reducer } = pvSlice;

export default reducer

