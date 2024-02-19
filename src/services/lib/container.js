import apiClient from "../apiClient";

export function _getContainers() {
    return apiClient.get(`/containers/*`)
}

export function _createContainer(dataToSubmit) {
    return apiClient.post(`/containers/`, dataToSubmit)
}

export function _updateContainer(id, dataToSubmit) {
    return apiClient.patch(`/containers/${id}`, dataToSubmit)
}

export function _deleteContainer(id) {
    return apiClient.delete(`/containers/${id}`)
}

