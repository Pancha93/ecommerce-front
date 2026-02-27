import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Inicio',
    iconName: 'home',
    route: '/inicio',
  },
  {
    navCap: 'Ordenlaboratorio',
  },
  {
    displayName: 'Ver Orden laboratorio',
    iconName: 'apps',
    route: '/ordenlaboratorio'
  },
  {
    displayName: 'Gestionar Ordenlaboratorios',
    iconName: 'list',
    route: '/ordenlaboratorio/leer'
  },
  {
    navCap: 'Generador de Reportes',
  },
  {
    displayName: 'Reportes',
    iconName: 'list',
    route: '/reportes',
  },
];
