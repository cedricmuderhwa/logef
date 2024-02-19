import apiClient from "../apiClient";

export function _getProvenances() {
    return apiClient.get(`/provenances/*`)
}

export function _createProvenance(dataToSubmit) {
    return apiClient.post(`/provenances/`, dataToSubmit)
}

export function _updateProvenance(id, dataToSubmit) {
    return apiClient.patch(`/provenances/${id}`, dataToSubmit)
}

export function _deleteProvenance(id) {
    return apiClient.delete(`/provenances/${id}`)
}

