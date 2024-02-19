import apiClient from "../apiClient";

export function _getConsignations() {
    return apiClient.get(`/consignations/*`)
}

export function _createConsignation(dataToSubmit) {
    return apiClient.post(`/consignations/`, dataToSubmit)
}

export function _updateConsignation(id, dataToSubmit) {
    return apiClient.patch(`/consignations/${id}`, dataToSubmit)
}

export function _deleteConsignation(id) {
    return apiClient.delete(`/consignations/${id}`)
}

