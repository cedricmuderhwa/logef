import apiClient from "../apiClient";

export function _getPvs() {
    return apiClient.get(`/pvs/*`)
}

export function _createPv(dataToSubmit) {
    return apiClient.post(`/pvs/`, dataToSubmit)
}

export function _updatePv(id, dataToSubmit) {
    return apiClient.patch(`/pvs/${id}`, dataToSubmit)
}

export function _deletePv(id) {
    return apiClient.delete(`/pvs/${id}`)
}

