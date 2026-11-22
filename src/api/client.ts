import axios from 'axios';

// Base API URL configured from environment variable (defaults to http://localhost:5000/api)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Enables HTTP-only cookies transmission for admin auth session
});

// Interceptor for standardized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Network error or backend server unavailable. Please ensure NestJS backend is running.';
    
    if (error.response) {
      // Backend returned error response (e.g. 400 Bad Request, 401 Unauthorized, 404 Not Found, 500)
      const data = error.response.data;
      if (data && data.message) {
        if (Array.isArray(data.message)) {
          errorMessage = data.message.join('. ');
        } else {
          errorMessage = data.message;
        }
      } else if (data && data.error) {
        errorMessage = data.error;
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please verify backend is running on port 5000.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    const enhancedError = new Error(errorMessage);
    (enhancedError as any).response = error.response;
    return Promise.reject(enhancedError);
  }
);
