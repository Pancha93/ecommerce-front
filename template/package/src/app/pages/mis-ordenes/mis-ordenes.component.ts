import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrdenService, Orden } from '../../services/orden.service';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-mis-ordenes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mis-ordenes.component.html'
})
export class MisOrdenesComponent implements OnInit {
  ordenes: Orden[] = [];
  ordenesFiltradas: Orden[] = [];
  esAdmin: boolean = false;
  filtroEstado: string | null = null;
  
  estadosDisponibles = [
    'PENDIENTE',
    'CONFIRMADA',
    'PROCESANDO',
    'ENVIADA',
    'ENTREGADA',
    'CANCELADA',
    'DEVUELTA'
  ];

  constructor(
    private ordenService: OrdenService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.esAdmin = this.authService.isAdmin();
    this.cargarOrdenes();
  }

  cargarOrdenes(): void {
    // Si es admin, cargar todas las órdenes. Si no, solo las del usuario
    const observable = this.esAdmin 
      ? this.ordenService.obtenerTodas() 
      : this.ordenService.obtenerMisOrdenes();
    
    observable.subscribe({
      next: (data) => {
        this.ordenes = data;
        this.ordenesFiltradas = data;
      },
      error: (error) => {
        console.error('Error al cargar órdenes', error);
        alert('Error al cargar órdenes: ' + (error.error?.error || error.message));
      }
    });
  }

  filtrarPorEstado(estado: string | null): void {
    this.filtroEstado = estado;
    if (estado === null) {
      this.ordenesFiltradas = this.ordenes;
    } else {
      this.ordenesFiltradas = this.ordenes.filter(orden => orden.estado === estado);
    }
  }

  cambiarEstado(orden: Orden): void {
    if (!orden.id) return;

    this.ordenService.actualizarEstado(orden.id, orden.estado).subscribe({
      next: () => {
        alert('Estado actualizado exitosamente');
        this.cargarOrdenes();
      },
      error: (error) => {
        console.error('Error al actualizar estado', error);
        alert('Error al actualizar estado: ' + (error.error?.error || error.message));
        this.cargarOrdenes(); // Recargar para revertir el cambio en la UI
      }
    });
  }

  getEstadoBadgeClass(estado: string): string {
    const clases: { [key: string]: string } = {
      'PENDIENTE': 'bg-warning',
      'CONFIRMADA': 'bg-info',
      'PROCESANDO': 'bg-primary',
      'ENVIADA': 'bg-success',
      'ENTREGADA': 'bg-success',
      'CANCELADA': 'bg-danger',
      'DEVUELTA': 'bg-secondary'
    };
    return clases[estado] || 'bg-secondary';
  }

  verDetalle(id: number): void {
    // Navegar a página de detalle de orden (puedes implementar esto)
    console.log('Ver detalle de orden:', id);
  }

  cancelarOrden(id: number): void {
    if (confirm('¿Estás seguro de cancelar esta orden?')) {
      this.ordenService.actualizarEstado(id, 'CANCELADA').subscribe({
        next: () => {
          alert('Orden cancelada exitosamente');
          this.cargarOrdenes();
        },
        error: (error) => {
          console.error('Error al cancelar orden', error);
          alert('Error al cancelar orden: ' + (error.error?.error || error.message));
        }
      });
    }
  }

  getItemImageUrl(item: any): string {
    // Usar imágenes locales rotando entre las 4 disponibles
    const imageNumber = item.productoId ? ((item.productoId - 1) % 4) + 1 : 1;
    return `assets/images/products/p${imageNumber}.jpg`;
  }
}
