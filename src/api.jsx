// Change this IP whenever your AWS EC2 instance gets a new public IP
// src/api.js
// export const API_URL = "http://44.198.56.67:8080/api/v1";
export const API_URL = "http://localhost:8080/api/v1";

export const getHeaders = () => {
  const token = localStorage.getItem('lifts_token'); // Or whatever key you use
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json' // <-- THIS IS CRITICAL
  };
};