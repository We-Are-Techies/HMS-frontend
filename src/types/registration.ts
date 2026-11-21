export interface PatientRegistrationData {
  name: string;
  age: string;
  gender: '1. Male' | '2. Female' | '';
  height: string;
  weight: string;
  systolicBP: string;
  diastolicBP: string;
  registrationDate: string;
  registrationTime: string;
}

export interface PatientRecord extends PatientRegistrationData {
  id: string;
  submittedAt: string;
  bmi?: number;
  bmiCategory?: string;
  bpCategory?: string;
}

export interface FormErrors {
  name?: string;
  age?: string;
  gender?: string;
  height?: string;
  weight?: string;
  systolicBP?: string;
  diastolicBP?: string;
  general?: string;
}

// Backend DTO mapping
export interface CreatePatientRegistrationPayload {
  patientIdentity: {
    name: string;
    age: number;
    gender: 'Male' | 'Female';
  };
  bodyMeasurements: {
    height: number;
    weight: number;
  };
  bloodPressureVitals: {
    systolic: number;
    diastolic: number;
  };
}

export interface BackendPatientRegistrationResponse {
  _id: string;
  patientIdentity: {
    name: string;
    age: number;
    gender: 'Male' | 'Female';
  };
  bodyMeasurements: {
    height: number;
    weight: number;
  };
  bloodPressureVitals: {
    systolic: number;
    diastolic: number;
  };
  registrationTimestamp: {
    date: string;
    time: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPatientResponse {
  statusCode: number;
  data: BackendPatientRegistrationResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
