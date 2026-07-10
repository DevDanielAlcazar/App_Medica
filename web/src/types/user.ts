export type Role = "paciente" | "medico" | "admin" | "soporte" | "contabilidad" | "superadmin";

export interface DoctorProfile {
  cedula: string;
  verified: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  doctorProfile?: DoctorProfile;
}
