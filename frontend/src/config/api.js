// frontend/src/config/api.js
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const getEndpoint = (path) => {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};