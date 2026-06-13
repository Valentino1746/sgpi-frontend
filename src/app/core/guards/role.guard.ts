import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export function roleGuard(requiredRole: string): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    if (authService.getUserRoles().includes(requiredRole)) {
      return true;
    }

    return inject(Router).createUrlTree(['/dashboard']);
  };
}
