import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'personnel', pathMatch: 'full' },
  {
    path: 'personnel',
    loadComponent: () => import('./pages/personnel/personnel.component').then(m => m.PersonnelComponent),
  },
  {
    path: 'missions',
    loadComponent: () => import('./pages/missions/missions.component').then(m => m.MissionsComponent),
  },
  {
    path: 'stellar',
    loadComponent: () => import('./pages/stellar/stellar.component').then(m => m.StellarComponent),
  },
  {
    path: 'bridge',
    loadComponent: () => import('./pages/bridge/bridge.component').then(m => m.BridgeComponent),
  },
  {
    path: 'comms',
    loadComponent: () => import('./pages/comms/comms.component').then(m => m.CommsComponent),
  },
  { path: '**', redirectTo: 'personnel' },
];
