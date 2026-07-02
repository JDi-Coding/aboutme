import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'personnel', pathMatch: 'full' },
  {
    path: 'personnel',
    title: 'Personnel File | JDI-Coding',
    loadComponent: () => import('./pages/personnel/personnel.component').then(m => m.PersonnelComponent),
  },
  {
    path: 'missions',
    title: 'Mission Logs (Portfolio) | JDI-Coding',
    loadComponent: () => import('./pages/missions/missions.component').then(m => m.MissionsComponent),
  },
  {
    path: 'stellar',
    title: 'Stellar Cartography | JDI-Coding',
    loadComponent: () => import('./pages/stellar/stellar.component').then(m => m.StellarComponent),
  },
  {
    path: 'bridge',
    title: 'Bridge Controls | JDI-Coding',
    loadComponent: () => import('./pages/bridge/bridge.component').then(m => m.BridgeComponent),
  },
  {
    path: 'comms',
    title: 'Subspace Communications | JDI-Coding',
    loadComponent: () => import('./pages/comms/comms.component').then(m => m.CommsComponent),
  },
  { path: '**', redirectTo: 'personnel' },
];
