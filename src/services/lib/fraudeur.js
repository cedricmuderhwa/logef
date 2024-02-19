import apiClient from "../apiClient";

export function _getFraudeurs() {
    return apiClient.get(`/fraudeurs/*`)
}

export function _createFraudeur(dataToSubmit) {
    return apiClient.post(`/fraudeurs/`, dataToSubmit)
}

export function _updateFraudeur(id, dataToSubmit) {
    return apiClient.patch(`/fraudeurs/${id}`, dataToSubmit)
}

export function _deleteFraudeur(id) {
    return apiClient.delete(`/fraudeurs/${id}`)
}

