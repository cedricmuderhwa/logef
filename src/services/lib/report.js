import apiClient from "../apiClient";

export function _getDashboardReport() {
    return apiClient.post(`/reports/dashboard/`)
}

export function _getStatsReport(dataToSubmit) {
    return apiClient.post(`/reports/stats/`, dataToSubmit)
}

export function _getQueryReport(dataToSubmit) {
    return apiClient.post(`/reports/query/`, dataToSubmit)
}



