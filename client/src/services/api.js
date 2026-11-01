import axios from "axios";

const API_BASE = "/api";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 45000 // 45 seconds for AI mystery generation
});

export const api = {
  // Check backend health
  checkHealth: async () => {
    const res = await apiClient.get("/health");
    return res.data;
  },

  // Create/Generate mystery
  generateMystery: async (premise, difficulty) => {
    const res = await apiClient.post("/cases", { premise, difficulty });
    return res.data;
  },

  // Retrieve public case data
  getCase: async (caseId) => {
    const res = await apiClient.get(`/cases/${caseId}`);
    return res.data;
  },

  // Discover clue
  discoverClue: async (caseId, clueId) => {
    const res = await apiClient.post(`/cases/${caseId}/clues/${clueId}/discover`);
    return res.data;
  },

  // Request next sequential hint
  requestHint: async (caseId) => {
    const res = await apiClient.post(`/cases/${caseId}/hints`);
    return res.data;
  },

  // Submit final accusation
  submitAccusation: async (caseId, suspectId, reasoning = "") => {
    const res = await apiClient.post(`/cases/${caseId}/accuse`, {
      suspectId,
      reasoning
    });
    return res.data;
  },

  // Retrieve completed results & revealed solution
  getCaseResult: async (caseId) => {
    const res = await apiClient.get(`/cases/${caseId}/result`);
    return res.data;
  }
};

export default api;
