export interface LoginResponse {
  token: string;
  tipo: string;
  claveTrabajador: string;
  nombreCompleto: string;
  roles: string[];
}

export interface SessionUser {
  claveTrabajador: string;
  nombreCompleto: string;
  roles: string[];
}
