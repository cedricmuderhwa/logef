import apiClient from "../apiClient";

export function _getSubstances() {
    return apiClient.get(`/substances/*`)
}

export function _createSubstance(dataToSubmit) {
    return apiClient.post(`/substances/`, dataToSubmit)
}

export function _updateSubstance(id, dataToSubmit) {
    return apiClient.patch(`/substances/${id}`, dataToSubmit)
}

export function _deleteSubstance(id) {
    return apiClient.delete(`/substances/${id}`)
}

