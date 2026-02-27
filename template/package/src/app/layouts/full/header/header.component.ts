import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, NgForOf } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AuthService } from "../../../services/auth-service.service";
import { CarritoService } from '../../../services/carrito.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, TablerIconsModule, MaterialModule],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  @Input() alineacion: 'izquierda' | 'derecha' = 'izquierda';
  
  cantidadItemsCarrito = 0;

  constructor(
    public authService: AuthService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCantidadCarrito();
  }

  cargarCantidadCarrito(): void {
    // Suscribirse al observable del carrito para recibir actualizaciones en tiempo real
    this.carritoService.carrito$.subscribe({
      next: (carrito) => {
        this.cantidadItemsCarrito = carrito?.items?.length || 0;
      },
      error: (error) => console.error('Error al cargar carrito', error)
    });
  }

  irATienda(): void {
    this.router.navigate(['/tienda']);
  }

  irAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }

  irAMisOrdenes(): void {
    this.router.navigate(['/mis-ordenes']);
  }

}

