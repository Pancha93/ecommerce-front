import {Component, Output, EventEmitter, Input, OnInit, ViewChildren, QueryList} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Router } from '@angular/router';
import { MatMenu } from '@angular/material/menu';
import { PermissionService } from '../../../pages/authentication/services/PermissionService';
import { NavItem } from '../sidebar/nav-item/nav-item';
import { logoProyecto } from '../../../pages/home/dataHome';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    TablerIconsModule,
    NgScrollbarModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @ViewChildren('menuRef') menuRefs!: QueryList<MatMenu>;

  navbarItems: NavItem[] = [];
  logo = logoProyecto;

  // Entidades generadas automáticamente
  private generatedEntities = ['Ordenlaboratorio'];

  constructor(
    private router: Router,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.cargarMenuNavbar();
  }

  private cargarMenuNavbar() {
    this.permissionService.getObjetos('OpcionMenu').subscribe({
      next: menu => {
        this.navbarItems = this.transformarMenuParaNavbar(menu);
      },
      error: error => {
        console.error('Error al cargar el menu del navbar:', error);
      }
    });
  }

  private transformarMenuParaNavbar(menuItems: NavItem[]): NavItem[] {
    const categorias = new Map<string, NavItem[]>();

    menuItems.forEach(item => {
      if (!item.navCap && item.displayName && item.route) {
        const categoria = this.determinarCategoria(item.route);
        if (!categorias.has(categoria)) {
          categorias.set(categoria, []);
        }
        categorias.get(categoria)?.push(item);
      }
    });

    const navbarItems: NavItem[] = [];
    categorias.forEach((items, categoria) => {
      if (items.length > 0) {
        navbarItems.push({
          displayName: categoria,
          children: items,
          ddType: 'dropdown',
          iconName: this.getCategoriaIcon(categoria)
        });
      }
    });

    return navbarItems;
  }

  private determinarCategoria(route: string): string {
    if (route.includes('inicio')) return 'Home';
    if (route.includes('permisos') || route.includes('usuarios') || route.includes('roles')) {
      return 'Gestión de Seguridad';
    }
    if (route.includes('reportes')) return 'Generador de Reportes';
    if (route.includes('archivo-ejemplo') || route.includes('importacion-datos')) {
      return 'Migración';
    }
    if (route.includes('configuracion')) return 'Configuración SMTP';

    // Verificar si es una entidad generada
    const segments = route.split('/');
    if (segments.length > 1) {
      const entityName = segments[1].toLowerCase();
      const matchedEntity = this.generatedEntities.find(entity => 
        entity.toLowerCase() === entityName
      );
      if (matchedEntity) {
        return this.capitalizeFirstLetter(matchedEntity);
      }
    }

    return 'Otros';
  }

  private getCategoriaIcon(categoria: string): string {
    switch (categoria) {
      case 'Home': return 'home';
      case 'Gestión de Seguridad': return 'security';
      case 'Generador de Reportes': return 'assessment';
      case 'Migración': return 'swap_horiz';
      case 'Configuración SMTP': return 'settings';
      default: return 'list';
    }
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/authentication/login']);
  }
}
