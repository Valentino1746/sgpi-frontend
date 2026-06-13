export interface Usuario {
  id: number;
  claveTrabajador: string;
  nombreCompleto: string;
  correoInstitucional: string;
  activo: boolean;
  roles: string[];
}
