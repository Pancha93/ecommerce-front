import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';

// Componentes Ecommerce
import { TiendaComponent } from './pages/tienda/tienda.component';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { MisOrdenesComponent } from './pages/mis-ordenes/mis-ordenes.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/authentication/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      // Rutas del Ecommerce
      { path: 'tienda', component: TiendaComponent },
      { path: 'producto/:id', component: DetalleProductoComponent },
      { path: 'carrito', component: CarritoComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'mis-ordenes', component: MisOrdenesComponent },
    ],
  },
  {
    path: 'authentication',
    component: BlankComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  },
];