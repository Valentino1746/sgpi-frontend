import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="users-page card">
      <div class="panel-head">
        <div>
          <span class="eyebrow">Administración RBAC</span>
          <h1>Gestión de usuarios y roles</h1>
          <p>Actualiza los permisos sin reiniciar el sistema, cumpliendo la US-1.2.</p>
        </div>
      </div>

      @if (feedback()) {
        <div class="success-banner">{{ feedback() }}</div>
      }

      <div class="table-shell">
        <table>
          <thead>
            <tr>
              <th>Clave</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Roles</th>
              <th>Activo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            @for (usuario of usuarios(); track usuario.id) {
              <tr>
                <td>{{ usuario.claveTrabajador }}</td>
                <td>{{ usuario.nombreCompleto }}</td>
                <td>{{ usuario.correoInstitucional }}</td>
                <td>
                  <select multiple [ngModel]="rolesSeleccionados(usuario)" (ngModelChange)="onRolesChange(usuario.id, $event)">
                    @for (rol of availableRoles; track rol) {
                      <option [value]="rol">{{ rol }}</option>
                    }
                  </select>
                </td>
                <td>
                  <span class="chip">{{ usuario.activo ? 'Sí' : 'No' }}</span>
                </td>
                <td>
                  <button class="btn-secondary" type="button" (click)="guardar(usuario)">Guardar</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6">No hay usuarios disponibles.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .users-page {
      padding: 1.5rem;
      display: grid;
      gap: 1rem;
    }

    .eyebrow {
      display: inline-block;
      margin-bottom: 0.5rem;
      color: var(--gold);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.78rem;
      font-weight: 700;
    }

    .panel-head p {
      color: var(--muted);
    }

    .success-banner {
      border-radius: var(--radius-md);
      border: 1px solid rgba(0, 74, 38, 0.12);
      background: rgba(0, 74, 38, 0.06);
      color: var(--primary-strong);
      padding: 0.85rem 1rem;
    }

    select[multiple] {
      min-width: 180px;
      min-height: 110px;
    }
  `]
})
export class UserManagementComponent {
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly feedback = signal('');
  protected readonly ediciones = signal<Record<number, string[]>>({});
  protected readonly availableRoles = ['ADMIN', 'INVESTIGADOR', 'DIRECTOR', 'RECTORIA'];

  constructor(private readonly usuarioService: UsuarioService) {
    this.reload();
  }

  onRolesChange(usuarioId: number, value: string[] | string): void {
    const roles = Array.isArray(value) ? value : [value];
    this.ediciones.update((current) => ({ ...current, [usuarioId]: roles }));
  }

  guardar(usuario: Usuario): void {
    const roles = this.ediciones()[usuario.id] ?? usuario.roles;
    this.usuarioService.asignarRoles(usuario.id, roles).subscribe({
      next: (actualizado) => {
        this.feedback.set(`Roles actualizados para ${actualizado.nombreCompleto}.`);
        this.usuarios.update((current) => current.map((item) => item.id === actualizado.id ? actualizado : item));
      }
    });
  }

  private reload(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (response) => this.usuarios.set(response),
      error: () => this.usuarios.set([])
    });
  }

  protected rolesSeleccionados(usuario: Usuario): string[] {
    return this.ediciones()[usuario.id] ?? usuario.roles;
  }
}
