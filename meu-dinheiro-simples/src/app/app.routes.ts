import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [authGuard]
  },
  {
    path: 'transacoes',
    loadComponent: () => import('./pages/transacoes/transacoes.page').then(m => m.TransacoesPage),
    canActivate: [authGuard]
  },
  {
    path: 'nova-transacao',
    loadComponent: () => import('./pages/nova-transacao/nova-transacao.page').then(m => m.NovaTransacaoPage),
    canActivate: [authGuard]
  },
  {
    path: 'orcamento',
    loadComponent: () => import('./pages/orcamento/orcamento.page').then(m => m.OrcamentoPage),
    canActivate: [authGuard]
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./pages/configuracoes/configuracoes.page').then(m => m.ConfiguracoesPage),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
];
