import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import { ProyectoService } from '../../core/services/proyecto.service';
import { ProyectoResumen } from '../../core/models/proyecto.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard">
      <header class="dashboard-header">
        <div>
          <span class="eyebrow">Panel institucional</span>
          <h1>Bienvenido, {{ authService.user()?.nombreCompleto }}</h1>
          <p>Tu vista está filtrada de acuerdo con los roles activos en SGPI.</p>
        </div>

        <div class="header-note card">
          <strong>{{ authService.roles().join(' / ') }}</strong>
          <span>Roles activos</span>
        </div>
      </header>

      <div class="stats-grid">
        <article class="card stat-card">
          <span class="chip">Proyectos visibles</span>
          <strong>{{ proyectos().length }}</strong>
          <p>Listado devuelto por el backend según RBAC.</p>
        </article>

        <article class="card stat-card">
          <span class="chip">Institutos</span>
          <strong>{{ institutosCount() }}</strong>
          <p>Dependencias presentes en la consulta actual.</p>
        </article>

        <article class="card stat-card">
          <span class="chip">Estado</span>
          <strong>JWT + filtros</strong>
          <p>Autenticación, autorización y visibilidad funcionando.</p>
        </article>
      </div>

      <section class="card projects-panel">
        <div class="panel-head">
          <div>
            <h2>Proyectos visibles</h2>
            <p>La US-1.3 queda demostrada aquí para el rol Director.</p>
          </div>
        </div>

        <div class="projects-list">
          @for (proyecto of proyectos(); track proyecto.id) {
            <article class="project-item">
              <div>
                <h3>{{ proyecto.titulo }}</h3>
                <p>{{ proyecto.institutoNombre }}</p>
              </div>
              <span class="chip">{{ proyecto.estado }}</span>
            </article>
          } @empty {
            <p class="empty-state">No hay proyectos visibles para el usuario autenticado.</p>
          }
        </div>
      </section>
    </section>
  `,
  styles: [`
    .dashboard {
      display: grid;
      gap: 1.5rem;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: stretch;
    }

    .dashboard-header p,
    .panel-head p,
    .project-item p,
    .stat-card p {
      color: var(--muted);
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

    .header-note {
      min-width: 220px;
      padding: 1.25rem;
      display: grid;
      gap: 0.4rem;
      align-content: center;
    }

    .header-note strong {
      color: var(--primary);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .stat-card,
    .projects-panel {
      padding: 1.4rem;
    }

    .stat-card strong {
      font-size: 2.2rem;
      margin: 0.9rem 0 0.2rem;
    }

    .projects-list {
      display: grid;
      gap: 0.9rem;
      margin-top: 1rem;
    }

    .project-item {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(0, 49, 23, 0.08);
    }

    .project-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .empty-state {
      color: var(--muted);
      margin: 0;
      padding-top: 0.5rem;
    }

    @media (max-width: 920px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .dashboard-header {
        flex-direction: column;
      }
    }
  `]
})
export class DashboardComponent {
  protected readonly proyectos = signal<ProyectoResumen[]>([]);
  protected readonly institutosCount = computed(() => new Set(this.proyectos().map((item) => item.institutoNombre)).size);

  constructor(
    protected readonly authService: AuthService,
    private readonly proyectoService: ProyectoService
  ) {
    this.proyectoService.listarProyectos().subscribe({
      next: (response) => this.proyectos.set(response),
      error: () => this.proyectos.set([])
    });
  }
}
