import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="login-page">
      <section class="login-shell card">
        <div class="hero-copy">
          <span class="eyebrow">Sistema Integral de Gestión de Proyectos</span>
          <h1>SGPI UNPA</h1>
          <p>Accede con tu clave institucional para administrar proyectos, roles y visibilidad por instituto.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
          <div class="field">
            <label for="clave">Clave de trabajador</label>
            <input id="clave" type="text" formControlName="claveTrabajador" placeholder="Ej. admin">
          </div>

          <div class="field">
            <label for="password">Contraseña</label>
            <input id="password" type="password" formControlName="password" placeholder="Ingresa tu contraseña">
          </div>

          @if (errorMessage()) {
            <div class="error-banner">{{ errorMessage() }}</div>
          }

          <button class="btn-primary" type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Validando acceso...' : 'Ingresar al sistema' }}
          </button>
        </form>
      </section>
    </main>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 2rem;
    }

    .login-shell {
      width: min(960px, 100%);
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      overflow: hidden;
    }

    .hero-copy {
      background:
        linear-gradient(160deg, rgba(0, 49, 23, 0.96), rgba(0, 74, 38, 0.9)),
        linear-gradient(90deg, rgba(255,255,255,0.05), transparent);
      color: #fff;
      padding: 3rem;
      display: grid;
      align-content: center;
      gap: 1rem;
    }

    .eyebrow {
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.8rem;
      color: rgba(255,255,255,0.75);
    }

    .hero-copy h1 {
      font-size: clamp(2.4rem, 5vw, 4rem);
    }

    .hero-copy p {
      max-width: 38ch;
      color: rgba(255,255,255,0.8);
      line-height: 1.7;
    }

    .login-form {
      padding: 3rem;
      display: grid;
      gap: 1.25rem;
      align-content: center;
      background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(252,251,250,0.98));
    }

    @media (max-width: 780px) {
      .login-shell {
        grid-template-columns: 1fr;
      }

      .hero-copy,
      .login-form {
        padding: 2rem;
      }
    }
  `]
})
export class LoginComponent {
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly form = this.formBuilder.nonNullable.group({
    claveTrabajador: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const { claveTrabajador, password } = this.form.getRawValue();
    this.authService.login(claveTrabajador, password).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Credenciales incorrectas');
      }
    });
  }
}
