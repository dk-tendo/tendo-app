export interface UserSchema {
  id: string;
  email: string;
  role: 'doctor' | 'patient';
  patientIds?: string[];
  firstName: string;
  lastName: string;
}
