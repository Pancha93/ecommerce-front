import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'E-commerce',
  },
  {
    displayName: 'Tienda',
    iconName: 'store',
    route: '/tienda',
  },
  {
    displayName: 'Mi Carrito',
    iconName: 'shopping_cart',
    route: '/carrito',
  },
  {
    displayName: 'Mis Órdenes',
    iconName: 'receipt',
    route: '/mis-ordenes',
  },
];
