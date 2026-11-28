import { apiClient } from './client';
import type { BackendPatientRegistrationResponse, CreatePatientRegistrationPayload, PatientMatch } from '../types/registration';

const path = '/v1/patient-registrations';

export const patientRegistrationService = {
  async lookup(identifier: string, signal: AbortSignal) {
    const response = await apiClient.post<PatientMatch[]>(`${path}/lookup`, { identifier }, { signal });
    return response.data;
  },

  async createRegistration(payload: CreatePatientRegistrationPayload, patientId?: string) {
    const response = await apiClient.post<BackendPatientRegistrationResponse>(
      patientId ? `${path}/consultations` : path,
      patientId ? { ...payload, patientId } : payload,
    );
    return response.data;
  },
};
