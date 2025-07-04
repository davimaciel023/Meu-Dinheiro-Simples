import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../pages/dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'transacoes',
        loadComponent: () => import('../pages/transacoes/transacoes.page').then(m => m.TransacoesPage)
      },
      {
        path: 'nova-transacao',
        loadComponent: () => import('../pages/nova-transacao/nova-transacao.page').then(m => m.NovaTransacaoPage)
      },
      {
        path: 'orcamento',
        loadComponent: () => import('../pages/orcamento/orcamento.page').then(m => m.OrcamentoPage)
      },
      {
        path: 'configuracoes',
        loadComponent: () => import('../pages/configuracoes/configuracoes.page').then(m => m.ConfiguracoesPage)
      }
    ]
  }
];
