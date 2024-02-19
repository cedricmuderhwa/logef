import apiClient from "../apiClient";

export function _getAgents(abortControler) {
  return apiClient.get(`/agents/*`, { signal: abortControler.signal });
}

export function _createAgent(dataToSubmit) {
  return apiClient.post(`/agents/`, dataToSubmit);
}

export function _updateAgent(id, dataToSubmit) {
  return apiClient.patch(`/agents/${id}`, dataToSubmit);
}

export function _deleteAgent(id) {
  return apiClient.delete(`/agents/${id}`);
}
