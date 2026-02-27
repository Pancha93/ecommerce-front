import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService, Producto } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { environment } from '../../../environments/environment';

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
            (error)="onImageError($event)"
            class="img-fluid rounded" 
            [alt]="producto.nombre">
          <div class="row mt-3">
            <div class="col-3" *ngFor="let imagen of producto.imagenes">
              <img 
                [src]="imagen.url" 
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
            <span class="badge bg-success ms-2" *ngIf="producto.destacado">Destacado</span>
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
              [disabled]="producto.stock === 0 || cantidad > producto.stock">
              <i class="bi bi-cart-plus"></i> Agregar al Carrito
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
    const imageUrl = this.imagenSeleccionada || this.producto?.imagenPrincipal || '';
    if (imageUrl) {
      // Si la URL ya es completa (http/https), usarla directamente
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      // Si comienza con 'assets/', es una imagen local
      if (imageUrl.startsWith('assets/')) {
        return imageUrl;
      }
      // Si es una ruta relativa, construir la URL con el backend
      return `${environment.apiUrl}${imageUrl}`;
    }
    // Usar imagen local de assets como respaldo
    const imageNumber = this.producto?.id ? ((this.producto.id - 1) % 4) + 1 : 1;
    return `assets/images/products/p${imageNumber}.jpg`;
  }

  onImageError(event: any): void {
    // Si falla la carga de imagen del backend, intentar con imágenes locales
    const target = event.target as HTMLImageElement;
    if (!target.src.includes('assets/images/products/')) {
      // Si no es una imagen local, usar una imagen local basada en el ID del producto
      const imageNumber = this.producto?.id ? ((this.producto.id - 1) % 4) + 1 : 1;
      target.src = `assets/images/products/p${imageNumber}.jpg`;
    } else {
      // Si también falló la imagen local, usar placeholder SVG
      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="400" viewBox="0 0 500 400"%3E%3Crect fill="%23ddd" width="500" height="400"/%3E%3Ctext fill="rgba(0,0,0,0.5)" font-family="sans-serif" font-size="24" dy="10" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
    }
  }
}
