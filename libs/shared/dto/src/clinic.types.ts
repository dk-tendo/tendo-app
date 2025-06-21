export interface Clinic {
  id: string;
  name: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicSchema {
  id: string;
  name: string;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  created_at: Date;
  updated_at: Date;
}
