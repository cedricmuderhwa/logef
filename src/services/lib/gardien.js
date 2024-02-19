import apiClient from "../apiClient";

export function _getGardiens() {
    return apiClient.get(`/gardiens/*`)
}

export function _createGardien(dataToSubmit) {
    return apiClient.post(`/gardiens/`, dataToSubmit)
}

export function _updateGardien(id, dataToSubmit) {
    return apiClient.patch(`/gardiens/${id}`, dataToSubmit)
}

export function _deleteGardien(id) {
    return apiClient.delete(`/gardiens/${id}`)
}

