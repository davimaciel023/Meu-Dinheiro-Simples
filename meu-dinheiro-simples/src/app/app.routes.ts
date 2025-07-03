import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'transacoes',
    loadComponent: () => import('./pages/transacoes/transacoes.page').then( m => m.TransacoesPage)
  },
  {
    path: 'nova-transacao',
    loadComponent: () => import('./pages/nova-transacao/nova-transacao.page').then( m => m.NovaTransacaoPage)
  },
  {
    path: 'orcamento',
    loadComponent: () => import('./pages/orcamento/orcamento.page').then( m => m.OrcamentoPage)
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./pages/configuracoes/configuracoes.page').then( m => m.ConfiguracoesPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
];
