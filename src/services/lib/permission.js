import apiClient from "../apiClient";

export function _getPermissions() {
    return apiClient.get(`/permissions/*`)
}

export function _createPermission(dataToSubmit) {
    return apiClient.post(`/permissions/`, dataToSubmit)
}

export function _updatePermission(id, dataToSubmit) {
    return apiClient.patch(`/permissions/${id}`, dataToSubmit)
}

