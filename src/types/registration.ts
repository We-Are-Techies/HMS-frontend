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
}
