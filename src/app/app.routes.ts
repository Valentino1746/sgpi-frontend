import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'admin/users',
        component: UserManagementComponent,
        canActivate: [roleGuard('ADMIN')]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
