import apiClient from "../apiClient";

const multipartConfig = {
    headers: {
        'Content-type': 'multipart/form-data'
    }
}

export function _getFrauds(dataToSubmit) {
    return apiClient.get(`/frauds/*?page=${dataToSubmit?.page}&limit=${dataToSubmit?.limit}&search=${dataToSubmit?.search}`)
}

export function _getSelectedFraud(id) {
    return apiClient.get(`/frauds/${id}`)
}

export function _createFraud(dataToSubmit) {
    return apiClient.post(`/frauds/`, dataToSubmit)
}

export function _updateFraud(id, dataToSubmit) {
    return apiClient.patch(`/frauds/${id}`, dataToSubmit)
}

export function _uploadFile(id, dataToSubmit) {
    return apiClient.patch(`/frauds/${id}`, dataToSubmit, multipartConfig)
}

export function _deleteFraud(id) {
    return apiClient.delete(`/frauds/${id}`)
}

