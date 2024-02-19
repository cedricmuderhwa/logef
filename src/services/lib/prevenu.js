import apiClient from "../apiClient";

export function _getPrevenus() {
    return apiClient.get(`/prevenus/*`)
}

export function _createPrevenu(dataToSubmit) {
    return apiClient.post(`/prevenus/`, dataToSubmit)
}

export function _updatePrevenu(id, dataToSubmit) {
    return apiClient.patch(`/prevenus/${id}`, dataToSubmit)
}

export function _deletePrevenu(id) {
    return apiClient.delete(`/prevenus/${id}`)
}

