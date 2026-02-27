import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit, OnDestroy {
  currentYear: number = new Date().getFullYear();
  showFooter: boolean = true;
  private routerSubscription?: Subscription;

  // Enlaces de ejemplo para cada columna
  companyLinks = [
    { name: 'Sobre Nosotros', url: '/login' },
    { name: 'Servicios', url: '/login' },
    { name: 'Contacto', url: '/login' },
    { name: 'Blog', url: '/login' }
  ];

  resourceLinks = [
    { name: 'Centro de Ayuda', url: '/login' },
    { name: 'FAQ', url: '/faq' },
    { name: 'Términos y Condiciones', url: '/login' },
    { name: 'Política de Privacidad', url: '/login' }
  ];

  socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com', icon: 'fab fa-facebook' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'fab fa-twitter' },
    { name: 'Instagram', url: 'https://instagram.com', icon: 'fab fa-instagram' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'fab fa-linkedin' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Verificar la ruta inicial
    this.checkRoute(this.router.url);

    // Suscribirse a cambios de ruta
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.urlAfterRedirects || event.url);
      });
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción cuando el componente se destruye
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private checkRoute(url: string): void {
    // Ocultar footer en las páginas de orden laboratorio
    const hideFooterRoutes = [
      '/ordenlaboratorio',
      '/ordenlaboratorio/leer',
      '/inicio',
      '/reportes'
    ];

    // Verificar si la URL actual coincide con alguna de las rutas donde se debe ocultar
    this.showFooter = !hideFooterRoutes.some(route => 
      url === route || url.startsWith(route + '/')
    );
  }
}
