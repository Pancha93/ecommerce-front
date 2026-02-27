import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService, Carrito, CarritoItem } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2 class="mb-4">Mi Carrito de Compras</h2>

      <div *ngIf="carrito && carrito.items.length > 0">
        <div class="row">
          <div class="col-md-8">
            <div class="card mb-3" *ngFor="let item of carrito.items">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-md-2">
                    <img 
                      [src]="getItemImageUrl(item)" 
                      class="img-fluid rounded"
                      [alt]="item.productoNombre">
                  </div>
                  <div class="col-md-4">
                    <h5>{{ item.productoNombre }}</h5>
                    <p class="text-muted mb-0">Stock disponible: {{ item.stockDisponible }}</p>
                  </div>
                  <div class="col-md-2">
                    <p class="mb-0">\${{ item.precioUnitario }}</p>
                  </div>
                  <div class="col-md-2">
                    <div class="input-group">
                      <button 
                        class="btn btn-sm btn-outline-secondary" 
                        (click)="actualizarCantidad(item, item.cantidad - 1)"
                        [disabled]="item.cantidad <= 1">
                        -
                      </button>
                      <input 
                        type="text" 
                        class="form-control text-center" 
                        [value]="item.cantidad" 
                        readonly>
                      <button 
                        class="btn btn-sm btn-outline-secondary" 
                        (click)="actualizarCantidad(item, item.cantidad + 1)"
                        [disabled]="item.cantidad >= item.stockDisponible">
                        +
                      </button>
                    </div>
                  </div>
                  <div class="col-md-1">
                    <strong>\${{ item.subtotal }}</strong>
                  </div>
                  <div class="col-md-1">
                    <button 
                      class="btn btn-sm btn-danger" 
                      (click)="eliminarItem(item.productoId)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card">
              <div class="card-header">
                <h5>Resumen del Pedido</h5>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <strong>\${{ carrito.total }}</strong>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Envío:</span>
                  <strong>Gratis</strong>
                </div>
                <hr>
                <div class="d-flex justify-content-between mb-3">
                  <h5>Total:</h5>
                  <h5 class="text-primary">\${{ carrito.total }}</h5>
                </div>
                <div class="d-grid gap-2">
                  <button 
                    class="btn btn-primary" 
                    [routerLink]="['/checkout']">
                    Proceder al Pago
                  </button>
                  <button 
                    class="btn btn-outline-secondary" 
                    [routerLink]="['/tienda']">
                    Continuar Comprando
                  </button>
                  <button 
                    class="btn btn-outline-danger" 
                    (click)="limpiarCarrito()">
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!carrito || carrito.items.length === 0" class="text-center py-5">
        <i class="bi bi-cart-x" style="font-size: 5rem; color: #ccc;"></i>
        <h3 class="mt-3">Tu carrito está vacío</h3>
        <p class="text-muted">Agrega productos a tu carrito para continuar</p>
        <button class="btn btn-primary" [routerLink]="['/tienda']">
          Ir a la Tienda
        </button>
      </div>
    </div>
  `
})
export class CarritoComponent implements OnInit {
  carrito: Carrito | null = null;

  constructor(private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.carritoService.obtenerCarrito().subscribe({
      next: (data) => this.carrito = data,
      error: (error) => console.error('Error al cargar carrito', error)
    });
  }

  actualizarCantidad(item: CarritoItem, nuevaCantidad: number): void {
    if (nuevaCantidad > 0 && nuevaCantidad <= item.stockDisponible) {
      this.carritoService.actualizarCantidad(item.productoId, nuevaCantidad).subscribe({
        next: (data) => this.carrito = data,
        error: (error) => console.error('Error al actualizar cantidad', error)
      });
    }
  }

  eliminarItem(productoId: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.carritoService.eliminarItem(productoId).subscribe({
        next: (data) => this.carrito = data,
        error: (error) => console.error('Error al eliminar item', error)
      });
    }
  }

  limpiarCarrito(): void {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      this.carritoService.limpiarCarrito().subscribe({
        next: () => this.carrito = null,
        error: (error) => console.error('Error al limpiar carrito', error)
      });
    }
  }

  getItemImageUrl(item: CarritoItem): string {
    // Usar imágenes locales rotando entre las 4 disponibles
    const imageNumber = item.productoId ? ((item.productoId - 1) % 4) + 1 : 1;
    return `assets/images/products/p${imageNumber}.jpg`;
  }
}
