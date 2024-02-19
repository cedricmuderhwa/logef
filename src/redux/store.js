import { configureStore } from "@reduxjs/toolkit"
import userReducer from './slices/users'
import sessionReducer from './slices/sessions'
import agentReducer from './slices/agents'
import consignationReducer from './slices/consignations'
import containerReducer from './slices/containers'
import escorteReducer from './slices/escortes'
import fraud_caseReducer from './slices/fraud_cases'
import materialReducer from './slices/materials'
import permissionReducer from './slices/permissions'
import prevenuReducer from './slices/prevenus'
import fraudeurReducer from './slices/fraudeurs'
import pvReducer from './slices/pvs'
import regionReducer from './slices/regions'
import serviceReducer from './slices/services'
import substanceReducer from './slices/substances'
import unitReducer from './slices/units'
import currentReducer from './slices/current'

const reducer = {
    users: userReducer,
    sessions: sessionReducer,
    agents: agentReducer,
    consignations: consignationReducer,
    containers: containerReducer,
    escortes: escorteReducer,
    fraud_cases: fraud_caseReducer,
    materials: materialReducer,
    permissions: permissionReducer,
    prevenus: prevenuReducer,
    pvs: pvReducer,
    regions: regionReducer,
    services: serviceReducer,
    substances: substanceReducer,
    units: unitReducer,
    current: currentReducer,
    fraudeurs: fraudeurReducer
}

const store = configureStore({
    reducer: reducer,
    devTools: true
})

export default store