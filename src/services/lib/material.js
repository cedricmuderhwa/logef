import apiClient from "../apiClient";

export function _getMaterials() {
    return apiClient.get(`/materials/*`)
}

export function _createMaterial(dataToSubmit) {
    return apiClient.post(`/materials/`, dataToSubmit)
}

export function _updateMaterial(id, dataToSubmit) {
    return apiClient.patch(`/materials/${id}`, dataToSubmit)
}

export function _deleteMaterial(id) {
    return apiClient.delete(`/materials/${id}`)
}

