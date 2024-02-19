import apiClient from "../apiClient";

export function _getRegions() {
    return apiClient.get(`/regions/*`)
}

export function _createRegion(dataToSubmit) {
    return apiClient.post(`/regions/`, dataToSubmit)
}

export function _updateRegion(id, dataToSubmit) {
    return apiClient.patch(`/regions/${id}`, dataToSubmit)
}

export function _deleteRegion(id) {
    return apiClient.delete(`/regions/${id}`)
}

