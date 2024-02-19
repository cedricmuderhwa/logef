import apiClient from "../apiClient";

export function _getServices() {
    return apiClient.get(`/services/*`)
}

export function _createService(dataToSubmit) {
    return apiClient.post(`/services/`, dataToSubmit)
}

export function _updateService(id, dataToSubmit) {
    return apiClient.patch(`/services/${id}`, dataToSubmit)
}

export function _deleteService(id) {
    return apiClient.delete(`/services/${id}`)
}

