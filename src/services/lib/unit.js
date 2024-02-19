import apiClient from "../apiClient";

export function _getUnits() {
    return apiClient.get(`/units/*`)
}

export function _createUnit(dataToSubmit) {
    return apiClient.post(`/units/`, dataToSubmit)
}

export function _updateUnit(id, dataToSubmit) {
    return apiClient.patch(`/units/${id}`, dataToSubmit)
}

export function _deleteUnit(id) {
    return apiClient.delete(`/units/${id}`)
}

