import { apiClient } from './client';
import type {
  AdminLoginCredentials,
  AdminLoginResponse,
  AdminProfileResponse,
  DashboardStatsResponse,
  AdminPatientsQueryParams,
  AdminPaginatedPatientsResponse,
  AdminSinglePatientResponse,
} from '../types/admin';

export const adminService = {
  /**
   * Admin Login: POST /api/v1/admin/auth/login
   * Validates credentials against MongoDB and sets secure HTTP-only cookie.
   */
  async login(credentials: AdminLoginCredentials): Promise<AdminLoginResponse> {
    const response = await apiClient.post<AdminLoginResponse>('/v1/admin/auth/login', credentials);
    return response.data;
  },

  /**
   * Admin Logout: POST /api/v1/admin/auth/logout
   * Clears the HTTP-only cookie session.
   */
  async logout(): Promise<{ statusCode: number; success: boolean; message: string }> {
    const response = await apiClient.post('/v1/admin/auth/logout');
    return response.data;
  },

  /**
   * Get Current Admin Profile: GET /api/v1/admin/auth/profile
   * Verifies the active JWT cookie session.
   */
  async getProfile(): Promise<AdminProfileResponse> {
    const response = await apiClient.get<AdminProfileResponse>('/v1/admin/auth/profile');
    return response.data;
  },

  /**
   * Get Admin Dashboard Stats: GET /api/v1/admin/dashboard/stats
   * Retrieves live metrics (total patients, today admissions, normal vs elevated BP).
   */
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    const response = await apiClient.get<DashboardStatsResponse>('/v1/admin/dashboard/stats');
    return response.data;
  },

  /**
   * Get Registered Patients (Admin): GET /api/v1/admin/patient-registrations
   * Supports server-side pagination, patient name/ID search, and date filter.
   */
  async getPatients(params?: AdminPatientsQueryParams): Promise<AdminPaginatedPatientsResponse> {
    const response = await apiClient.get<AdminPaginatedPatientsResponse>('/v1/admin/patient-registrations', {
      params,
    });
    return response.data;
  },

  /**
   * Get Single Patient Record (Admin): GET /api/v1/admin/patient-registrations/:id
   */
  async getPatientById(id: string): Promise<AdminSinglePatientResponse> {
    const response = await apiClient.get<AdminSinglePatientResponse>(`/v1/admin/patient-registrations/${id}`);
    return response.data;
  },
};

