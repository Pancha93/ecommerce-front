import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService, Producto } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container" *ngIf="producto">
      <div class="row">
        <div class="col-md-6">
          <img 
            [src]="getImageUrl()" 
            class="img-fluid rounded" 
            [alt]="producto.nombre">
          <div class="row mt-3">
            <div class="col-3" *ngFor="let imagen of producto.imagenes">
              <img 
                [src]="getSecondaryImageUrl(imagen.url)" 
                class="img-thumbnail cursor-pointer" 
                (click)="seleccionarImagen(imagen.url)"
                [alt]="producto.nombre">
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <h1>{{ producto.nombre }}</h1>
          <div class="mb-3">
            <span class="badge bg-primary">{{ producto.categoriaNombre }}</span>
            <span class="badge bg-success ms-2" *ngIf="producto.destacado">
              <i class="bi bi-star-fill"></i> Destacado
            </span>
            <span class="badge bg-danger ms-2" *ngIf="producto.activo === false">
              <i class="bi bi-x-circle"></i> INACTIVO
            </span>
          </div>

          <div class="mb-3">
            <span *ngIf="producto.precioOferta" class="h4 text-decoration-line-through text-muted">
              \${{ producto.precio }}
            </span>
            <span class="h2 text-primary ms-2">
              \${{ producto.precioOferta || producto.precio }}
            </span>
          </div>

          <div class="mb-3">
            <strong>SKU:</strong> {{ producto.sku }}<br>
            <strong>Marca:</strong> {{ producto.marca }}<br>
            <strong>Stock disponible:</strong> 
            <span [class.text-danger]="producto.stock === 0" 
                  [class.text-success]="producto.stock > 0">
              {{ producto.stock }} unidades
            </span>
          </div>

          <div class="mb-3">
            <h5>Descripción</h5>
            <p>{{ producto.descripcion }}</p>
          </div>

          <!-- Alerta de producto inactivo -->
          <div *ngIf="producto.activo === false" class="alert alert-warning" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <strong>Producto no disponible:</strong> Este producto está actualmente inactivo y no puede ser comprado.
          </div>

          <div class="mb-3">
            <label class="form-label">Cantidad:</label>
            <div class="input-group" style="width: 150px;">
              <button class="btn btn-outline-secondary" (click)="disminuirCantidad()">-</button>
              <input type="number" class="form-control text-center" [(ngModel)]="cantidad" min="1" [max]="producto.stock">
              <button class="btn btn-outline-secondary" (click)="aumentarCantidad()">+</button>
            </div>
          </div>

          <div class="d-grid gap-2">
            <button 
              class="btn btn-primary btn-lg" 
              (click)="agregarAlCarrito()"
              [disabled]="producto.stock === 0 || cantidad > producto.stock || producto.activo === false">
              <i class="bi bi-cart-plus"></i> 
              {{ producto.activo === false ? 'Producto no disponible' : 'Agregar al Carrito' }}
            </button>
            <button class="btn btn-outline-secondary" [routerLink]="['/tienda']">
              Volver a la Tienda
            </button>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!producto" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  `,
  styles: [`
    .cursor-pointer { cursor: pointer; }
    .cursor-pointer:hover { opacity: 0.8; }
  `]
})
export class DetalleProductoComponent implements OnInit {
  producto: Producto | null = null;
  imagenSeleccionada: string = '';
  cantidad: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProducto(id);
  }

  cargarProducto(id: number): void {
    this.productoService.obtenerPorId(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.imagenSeleccionada = data.imagenPrincipal || '';
      },
      error: (error) => console.error('Error al cargar producto', error)
    });
  }

  seleccionarImagen(url: string): void {
    this.imagenSeleccionada = url;
  }

  aumentarCantidad(): void {
    if (this.producto && this.cantidad < this.producto.stock) {
      this.cantidad++;
    }
  }

  disminuirCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  agregarAlCarrito(): void {
    if (this.producto) {
      this.carritoService.agregarItem({ 
        productoId: this.producto.id!, 
        cantidad: this.cantidad 
      }).subscribe({
        next: () => {
          alert('Producto agregado al carrito');
          this.cantidad = 1;
        },
        error: (error) => console.error('Error al agregar al carrito', error)
      });
    }
  }

  getImageUrl(): string {
    // Usar imágenes locales rotando entre las 4 disponibles
    const imageNumber = this.producto?.id ? ((this.producto.id - 1) % 4) + 1 : 1;
    return `assets/images/products/p${imageNumber}.jpg`;
  }

  getSecondaryImageUrl(url: string): string {
    // Usar imágenes locales para las miniaturas también
    const imageNumber = this.producto?.id ? ((this.producto.id - 1) % 4) + 1 : 1;
    return `assets/images/products/p${imageNumber}.jpg`;
  }
}
