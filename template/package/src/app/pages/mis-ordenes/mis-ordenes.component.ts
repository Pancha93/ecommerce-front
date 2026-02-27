import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrdenService, Orden } from '../../services/orden.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mis-ordenes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2 class="mb-4">Mis Órdenes</h2>

      <div *ngIf="ordenes.length > 0">
        <div class="card mb-3" *ngFor="let orden of ordenes">
          <div class="card-header">
            <div class="row align-items-center">
              <div class="col-md-3">
                <strong>Orden #{{ orden.numeroOrden }}</strong>
              </div>
              <div class="col-md-3">
                <span class="badge" [ngClass]="getEstadoBadgeClass(orden.estado)">
                  {{ orden.estado }}
                </span>
              </div>
              <div class="col-md-3">
                <small class="text-muted">{{ orden.fechaCreacion | date:'short' }}</small>
              </div>
              <div class="col-md-3 text-end">
                <strong class="text-primary">\${{ orden.total }}</strong>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-8">
                <h6>Productos:</h6>
                <div *ngFor="let item of orden.items" class="mb-2">
                  <div class="d-flex align-items-center">
                    <img 
                      [src]="getItemImageUrl(item)" 
                      (error)="onImageError($event, item)"
                      class="me-3" 
                      style="width: 50px; height: 50px; object-fit: cover;"
                      [alt]="item.productoNombre">
                    <div class="flex-grow-1">
                      <strong>{{ item.productoNombre }}</strong><br>
                      <small class="text-muted">
                        Cantidad: {{ item.cantidad }} × \${{ item.precioUnitario }} = \${{ item.subtotal }}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <h6>Detalles del Pedido:</h6>
                <p class="mb-1">
                  <strong>Subtotal:</strong> \${{ orden.subtotal }}<br>
                  <strong>Envío:</strong> \${{ orden.costoEnvio }}<br>
                  <strong>Impuestos:</strong> \${{ orden.impuestos }}<br>
                  <strong>Total:</strong> <span class="text-primary">\${{ orden.total }}</span>
                </p>
                <p class="mb-1">
                  <strong>Método de pago:</strong> {{ orden.metodoPago || 'No especificado' }}
                </p>
                <div *ngIf="orden.direccionEnvio">
                  <strong>Dirección de envío:</strong><br>
                  <small>
                    {{ orden.direccionEnvio.nombreCompleto }}<br>
                    {{ orden.direccionEnvio.direccionLinea1 }}<br>
                    {{ orden.direccionEnvio.ciudad }}, {{ orden.direccionEnvio.estadoProvincia }}
                  </small>
                </div>
              </div>
            </div>
            <div *ngIf="orden.notas" class="mt-3">
              <strong>Notas:</strong> {{ orden.notas }}
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="ordenes.length === 0" class="text-center py-5">
        <i class="bi bi-bag-x" style="font-size: 5rem; color: #ccc;"></i>
        <h3 class="mt-3">No tienes órdenes aún</h3>
        <p class="text-muted">Realiza tu primera compra en nuestra tienda</p>
        <button class="btn btn-primary" [routerLink]="['/tienda']">
          Ir a la Tienda
        </button>
      </div>
    </div>
  `
})
export class MisOrdenesComponent implements OnInit {
  ordenes: Orden[] = [];

  constructor(private ordenService: OrdenService) { }

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes(): void {
    this.ordenService.obtenerMisOrdenes().subscribe({
      next: (data) => this.ordenes = data,
      error: (error) => console.error('Error al cargar órdenes', error)
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

  getItemImageUrl(item: any): string {
    if (item.productoImagen) {
      // Si la URL ya es completa (http/https), usarla directamente
      if (item.productoImagen.startsWith('http')) {
        return item.productoImagen;
      }
      // Si comienza con 'assets/', es una imagen local
      if (item.productoImagen.startsWith('assets/')) {
        return item.productoImagen;
      }
      // Si es una ruta relativa, construir la URL con el backend
      return `${environment.apiUrl}${item.productoImagen}`;
    }
    // Usar imagen local de assets como respaldo
    const imageNumber = item.productoId ? ((item.productoId - 1) % 4) + 1 : 1;
    return `assets/images/products/p${imageNumber}.jpg`;
  }

  onImageError(event: any, item: any): void {
    // Si falla la carga de imagen del backend, intentar con imágenes locales
    const target = event.target as HTMLImageElement;
    if (!target.src.includes('assets/images/products/')) {
      // Si no es una imagen local, usar una imagen local basada en el ID del producto
      const imageNumber = item.productoId ? ((item.productoId - 1) % 4) + 1 : 1;
      target.src = `assets/images/products/p${imageNumber}.jpg`;
    } else {
      // Si también falló la imagen local, usar placeholder SVG
      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"%3E%3Crect fill="%23ddd" width="50" height="50"/%3E%3Ctext fill="rgba(0,0,0,0.5)" font-family="sans-serif" font-size="10" dy="5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ESin imagen%3C/text%3E%3C/svg%3E';
    }
  }
}
