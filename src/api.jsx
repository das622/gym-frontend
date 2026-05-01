export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const getHeaders = () => {
  const token = localStorage.getItem('lifts_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};