export const genders = ['Male', 'Female', 'Transgender', 'Prefer not to disclose'] as const;
export type Gender = (typeof genders)[number];
export type Language = 'en' | 'ta';
export const patientTitles = ['Mr', 'Ms', 'Mrs', 'Baby'] as const;
export type PatientTitle = (typeof patientTitles)[number];

export interface PatientIdentity {
  name: string;
  title?: PatientTitle;
  age: number;
  ageMonths?: number;
  gender: Gender;
  phone?: string;
}

export function formatPatientName({ title, name }: PatientIdentity): string {
  return title ? `${title} ${name}` : name;
}

export interface PatientMatch {
  patientId: number | string;
  patientIdentity: PatientIdentity;
}

export interface CreatePatientRegistrationPayload {
  clinicName: string;
  language: Language;
  patientIdentity: PatientIdentity;
  bodyMeasurements: { height?: number; weight?: number };
  bloodPressureVitals: { systolic?: number; diastolic?: number };
}

export interface BackendPatientRegistrationResponse extends Omit<CreatePatientRegistrationPayload, 'clinicName' | 'language'> {
  _id: string;
  patientId?: number | string;
  clinicName?: string;
  language?: Language;
  registrationTimestamp: { date: string; time: string };
  createdAt: string;
  updatedAt: string;
}
