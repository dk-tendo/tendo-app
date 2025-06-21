export interface User {
  email?: string;
  firstName?: string;
  lastName?: string;
  id?: string;
  role?: 'doctor' | 'patient';
  patientIds?: string[];
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
  clinicId?: string; // This will comprise of clinic name + _ + street
  incompleteTaskIds?: string[];
  completedTaskIds?: string[];
}

// export interface UserSchema {
//   id?: string;
//   email: string;
//   first_name: string;
//   last_name: string;
//   role?: string;
//   patient_ids?: string[];
//   image_url?: string;
//   clinic_id?: string;
//   incomplete_task_ids?: string[];
//   completed_task_ids?: string[];
//   created_at: Date;
//   updated_at: Date;
// }

export interface CreateUserValidationErrors {
  name?: string;
  email?: string;
  age?: string;
}
