export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const getHeaders = () => {
  const token = localStorage.getItem('lifts_token'); 
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json' 
  };
};