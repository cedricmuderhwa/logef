import apiClient from "../apiClient";

export function _getEscortes() {
    return apiClient.get(`/escortes/*`)
}

export function _createEscorte(dataToSubmit) {
    return apiClient.post(`/escortes/`, dataToSubmit)
}

export function _updateEscorte(id, dataToSubmit) {
    return apiClient.patch(`/escortes/${id}`, dataToSubmit)
}

export function _deleteEscorte(id) {
    return apiClient.delete(`/escortes/${id}`)
}

