import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProyectoResumen } from '../models/proyecto.models';

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  constructor(private readonly http: HttpClient) {
  }

  listarProyectos(): Observable<ProyectoResumen[]> {
    return this.http.get<ProyectoResumen[]>('/api/proyectos');
  }
}
