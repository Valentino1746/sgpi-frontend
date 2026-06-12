import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HealthService, HealthResponse } from './services/health.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('sgpi-frontend');
  
  // Signals to hold state
  protected readonly status = signal<'loading' | 'success' | 'error'>('loading');
  protected readonly message = signal<string>('Conectando...');
  
  private destroy$ = new Subject<void>();

  constructor(private healthService: HealthService) {}

  ngOnInit(): void {
    this.checkBackendHealth();
  }

  protected checkBackendHealth(): void {
    this.status.set('loading');
    this.message.set('Verificando...');

    this.healthService.getHealth()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HealthResponse) => {
          this.status.set('success');
          this.message.set(response.message || '¡Conexión Exitosa!');
        },
        error: (error) => {
          console.error('Error fetching backend health:', error);
          this.status.set('error');
          this.message.set('Error al conectar con el Backend');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
