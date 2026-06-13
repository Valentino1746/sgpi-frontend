import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { LoginResponse, SessionUser } from '../models/auth.models';

const TOKEN_KEY = 'sgpi.token';
const USER_KEY = 'sgpi.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenState = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly userState = signal<SessionUser | null>(this.readStoredUser());

  readonly user = computed(() => this.userState());
  readonly roles = computed(() => this.userState()?.roles ?? []);

  constructor(private readonly http: HttpClient, private readonly router: Router) {
  }

  login(claveTrabajador: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { claveTrabajador, password }).pipe(
      tap((response) => {
        const user: SessionUser = {
          claveTrabajador: response.claveTrabajador,
          nombreCompleto: response.nombreCompleto,
          roles: response.roles
        };
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.tokenState.set(response.token);
        this.userState.set(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.tokenState.set(null);
    this.userState.set(null);
    void this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return Boolean(this.tokenState());
  }

  getToken(): string | null {
    return this.tokenState();
  }

  getUserRoles(): string[] {
    return this.roles();
  }

  private readStoredUser(): SessionUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  }
}
