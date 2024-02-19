import apiClient from "../apiClient";

export function _getLogs() {
  return apiClient.get(`/logs/*`);
}
