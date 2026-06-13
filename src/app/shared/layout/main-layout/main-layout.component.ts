import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="layout-shell">
      <aside class="sidebar card" [class.sidebar-open]="sidebarOpen()">
        <div class="brand-block">
          <span class="brand-kicker">UNPA</span>
          <h1>SGPI</h1>
          <p>Gestión institucional de investigación</p>
        </div>

        <nav class="nav-links">
          @for (item of navigation(); track item.label) {
            <a [routerLink]="item.link" routerLinkActive="active">{{ item.label }}</a>
          }
        </nav>
      </aside>

      <div class="layout-main">
        <header class="topbar card">
          <button class="menu-toggle btn-secondary" type="button" (click)="toggleSidebar()">Menú</button>

          <div class="search-shell">
            <span>Panel de control SGPI</span>
          </div>

          <div class="profile-shell">
            <div>
              <strong>{{ authService.user()?.nombreCompleto }}</strong>
              <span>{{ authService.user()?.claveTrabajador }}</span>
            </div>
            <button class="btn-secondary" type="button" (click)="authService.logout()">Salir</button>
          </div>
        </header>

        <main class="content-area">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-shell {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 1.25rem;
      padding: 1.25rem;
    }

    .sidebar,
    .topbar {
      background: rgba(255, 255, 255, 0.78);
    }

    .sidebar {
      padding: 1.5rem;
      display: grid;
      gap: 2rem;
      align-content: start;
    }

    .brand-kicker {
      color: var(--gold);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .brand-block h1 {
      margin: 0.35rem 0;
      color: var(--primary);
    }

    .brand-block p {
      color: var(--muted);
      line-height: 1.6;
    }

    .nav-links {
      display: grid;
      gap: 0.5rem;
    }

    .nav-links a {
      text-decoration: none;
      color: var(--muted);
      padding: 0.85rem 1rem;
      border-radius: var(--radius-md);
      transition: background 120ms ease, color 120ms ease;
    }

    .nav-links a.active,
    .nav-links a:hover {
      background: linear-gradient(135deg, rgba(0, 49, 23, 0.95), rgba(0, 74, 38, 0.92));
      color: #fff;
    }

    .layout-main {
      display: grid;
      gap: 1rem;
      align-content: start;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      padding: 1rem 1.25rem;
    }

    .profile-shell {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .profile-shell span {
      display: block;
      color: var(--muted);
      font-size: 0.85rem;
      margin-top: 0.15rem;
    }

    .search-shell {
      flex: 1;
      min-height: 52px;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      border-radius: var(--radius-md);
      background: linear-gradient(90deg, rgba(0, 49, 23, 0.06), rgba(119, 90, 25, 0.05));
      color: var(--primary);
      font-weight: 600;
    }

    .content-area {
      padding-bottom: 1rem;
    }

    .menu-toggle {
      display: none;
    }

    @media (max-width: 980px) {
      .layout-shell {
        grid-template-columns: 1fr;
      }

      .sidebar {
        display: none;
      }

      .sidebar.sidebar-open {
        display: grid;
      }

      .topbar {
        flex-wrap: wrap;
      }

      .menu-toggle {
        display: inline-flex;
      }
    }
  `]
})
export class MainLayoutComponent {
  protected readonly sidebarOpen = signal(false);
  protected readonly navigation = computed(() => {
    const base = [
      { label: 'Dashboard', link: '/dashboard' }
    ];

    if (this.authService.getUserRoles().includes('ADMIN')) {
      base.push({ label: 'Usuarios', link: '/admin/users' });
    }

    return base;
  });

  constructor(protected readonly authService: AuthService) {
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }
}
