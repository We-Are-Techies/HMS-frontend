import type { BackendPatientRegistrationResponse } from './registration';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  accessToken: string;
  admin: AdminUser;
}

export interface AdminProfileResponse {
  statusCode: number;
  admin: AdminUser;
}

export interface DashboardStats {
  totalPatients: number;
  todayRegistrations: number;
  normalBPCount: number;
  elevatedBPCount: number;
  recentRegistrations: BackendPatientRegistrationResponse[];
}

export interface DashboardStatsResponse {
  statusCode: number;
  data: DashboardStats;
}

export interface AdminPatientsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
}

export interface AdminPaginatedPatientsResponse {
  statusCode: number;
  data: BackendPatientRegistrationResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminSinglePatientResponse {
  statusCode: number;
  data: BackendPatientRegistrationResponse;
}
