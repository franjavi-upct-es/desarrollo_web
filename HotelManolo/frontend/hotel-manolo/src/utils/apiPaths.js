const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api/v1";

export const authPaths = {
  login: `${API_BASE}/auth/login`,
};

export const pdfPaths = {
  add: `${API_BASE}/pdfs/add`,
  list: `${API_BASE}/pdfs/list`
};

export const dashboardPaths = {
  stats: `${API_BASE}/dashboard/stats`
};

export default { authPaths, pdfPaths, dashboardPaths };
