import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from '../models/usuario.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private readonly http: HttpClient) {
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>('/api/admin/usuarios');
  }

  asignarRoles(usuarioId: number, roles: string[]): Observable<Usuario> {
    return this.http.put<Usuario>('/api/admin/usuarios/roles', { usuarioId, roles });
  }
}
