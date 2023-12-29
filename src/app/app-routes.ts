import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'car-list' },
  {
    path: 'car-list',
    loadChildren: () =>
      import('./car-control/car-list/car-list.routes').then(
        (m) => m.CAR_ROUTES
      ),
  },
  {
    path: 'driver-list',
    loadChildren: () =>
      import('./car-control/driver-list/driver-list.routes').then(
        (m) => m.DRIVER_ROUTES
      ),
  },
  {
    path: 'car-user-list',
    loadChildren: () =>
      import('./car-control/car-user-list/car-user-list.routes').then(
        (m) => m.CAR_USER_ROUTES
      ),
  },
];
