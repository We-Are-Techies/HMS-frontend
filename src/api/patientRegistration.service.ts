import { apiClient } from './client';
import type { 
  PatientRegistrationData, 
  CreatePatientRegistrationPayload, 
  BackendPatientRegistrationResponse, 
  PaginatedPatientResponse 
} from '../types/registration';

/**
 * Maps raw form input values to the exact backend DTO structure required by NestJS.
 */
export const mapFormToBackendDto = (data: PatientRegistrationData): CreatePatientRegistrationPayload => {
  const genderValue: 'Male' | 'Female' = data.gender.includes('Female') ? 'Female' : 'Male';

  return {
    patientIdentity: {
      name: data.name.trim(),
      age: Math.floor(Number(data.age)),
      gender: genderValue,
    },
    bodyMeasurements: {
      height: Math.floor(Number(data.height)),
      weight: Math.floor(Number(data.weight)),
    },
    bloodPressureVitals: {
      systolic: Math.floor(Number(data.systolicBP)),
      diastolic: Math.floor(Number(data.diastolicBP)),
    },
  };
};

export const patientRegistrationService = {
  /**
   * Registers a new patient via POST /api/v1/patient-registrations
   */
  async createRegistration(formData: PatientRegistrationData): Promise<BackendPatientRegistrationResponse> {
    const payload = mapFormToBackendDto(formData);
    const response = await apiClient.post<BackendPatientRegistrationResponse>(
      '/v1/patient-registrations',
      payload
    );
    return response.data;
  },

  /**
   * Retrieves all patient registrations with pagination via GET /api/v1/patient-registrations
   */
  async getAllRegistrations(page = 1, limit = 10): Promise<PaginatedPatientResponse> {
    const response = await apiClient.get<PaginatedPatientResponse>('/v1/patient-registrations', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Retrieves a single registration by MongoDB ID via GET /api/v1/patient-registrations/:id
   */
  async getRegistrationById(id: string): Promise<BackendPatientRegistrationResponse> {
    const response = await apiClient.get<BackendPatientRegistrationResponse>(`/v1/patient-registrations/${id}`);
    return response.data;
  },
};
