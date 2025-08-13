// This file will replace the Supabase types file for MongoDB usage

export interface Application {
  blockchain_tx_hash?: string | null;
  id?: string;
  ipfs_hash?: string | null;
  license_type: string;
  status?: string | null;
  submission_date?: Date | null;
  user_id?: string | null;
}

export interface Approval {
  application_id?: string | null;
  approval_date?: Date | null;
  approved_by?: string | null;
  department_name: string;
  id?: string;
  remarks?: string | null;
}

export interface AuditLog {
  action: string;
  created_at?: Date | null;
  details?: Record<string, any> | null;
  id?: string;
  user_id?: string | null;
}

export interface Document {
  application_id?: string | null;
  doc_type: string;
  file_url: string;
  id?: string;
  uploaded_at?: Date | null;
}

export interface User {
  created_at?: Date | null;
  email: string;
  id?: string;
  name: string;
  password_hash: string;
  role: string;
}
