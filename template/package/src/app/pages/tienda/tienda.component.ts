import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService, Producto } from '../../services/producto.service';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { CarritoService } from '../../services/carrito.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar de Categorías -->
        <div class="col-md-3">
          <div class="card">
            <div class="card-header">
              <h5>Categorías</h5>
            </div>
            <div class="list-group list-group-flush">
              <button 
                class="list-group-item list-group-item-action" 
                [class.active]="categoriaSeleccionada === null"
                (click)="filtrarPorCategoria(null)">
                Todas
              </button>
              <button 
                *ngFor="let categoria of categorias"
                class="list-group-item list-group-item-action"
                [class.active]="categoriaSeleccionada === categoria.id"
                (click)="categoria.id && filtrarPorCategoria(categoria.id)">
                {{ categoria.nombre }} ({{ categoria.cantidadProductos }})
              </button>
            </div>
          </div>
        </div>

        <!-- Grid de Productos -->
        <div class="col-md-9">
          <div class="mb-3">
            <div class="row">
              <div class="col-md-6">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar productos..."
                  [(ngModel)]="terminoBusqueda"
                  (ngModelChange)="buscarProductos()">
              </div>
              <div class="col-md-6">
                <div class="btn-group" role="group">
                  <button class="btn btn-outline-primary" (click)="cargarDestacados()">Destacados</button>
                  <button class="btn btn-outline-primary" (click)="cargarNuevos()">Nuevos</button>
                  <button class="btn btn-outline-primary" (click)="cargarOfertas()">Ofertas</button>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 mb-4" *ngFor="let producto of productosFiltrados">
              <div class="card h-100">
                <img 
                  [src]="getProductImageUrl(producto)" 
                  (error)="onImageError($event)"
                  class="card-img-top" 
                  [alt]="producto.nombre"
                  style="height: 200px; object-fit: cover;">
                <div class="card-body">
                  <h5 class="card-title">{{ producto.nombre }}</h5>
                  <p class="card-text text-muted">{{ producto.descripcion?.substring(0, 100) }}...</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <span *ngIf="producto.precioOferta" class="text-decoration-line-through text-muted">
                        \${{ producto.precio }}
                      </span>
                      <span class="h5 text-primary ms-2">
                        \${{ producto.precioOferta || producto.precio }}
                      </span>
                    </div>
                    <span class="badge bg-secondary">Stock: {{ producto.stock }}</span>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="d-grid gap-2">
                    <button 
                      class="btn btn-primary" 
                    [routerLink]="['/producto', producto.id]">
                      Ver Detalles
                    </button>
                    <button 
                      class="btn btn-success" 
                      (click)="agregarAlCarrito(producto)"
                      [disabled]="producto.stock === 0">
                      <i class="bi bi-cart-plus"></i> Agregar al Carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="productosFiltrados.length === 0" class="text-center py-5">
            <h3>No se encontraron productos</h3>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { transition: transform 0.2s; }
    .card:hover { transform: translateY(-5px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
  `]
})
export class TiendaComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];
  categoriaSeleccionada: number | null = null;
  terminoBusqueda: string = '';

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private carritoService: CarritoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
    
    // Verificar si hay un parámetro de categoría en la URL
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        const categoriaId = Number(params['categoria']);
        this.filtrarPorCategoria(categoriaId);
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerActivas().subscribe({
      next: (data) => this.categorias = data,
      error: (error) => console.error('Error al cargar categorías', error)
    });
  }

  cargarProductos(): void {
    this.productoService.obtenerActivos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
      },
      error: (error) => console.error('Error al cargar productos', error)
    });
  }

  filtrarPorCategoria(categoriaId: number | null): void {
    this.categoriaSeleccionada = categoriaId;
    if (categoriaId === null) {
      this.productosFiltrados = this.productos;
    } else {
      this.productoService.obtenerPorCategoria(categoriaId).subscribe({
        next: (data) => this.productosFiltrados = data,
        error: (error) => console.error('Error al filtrar productos', error)
      });
    }
  }

  buscarProductos(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.productosFiltrados = this.productos;
    } else {
      this.productoService.buscar(this.terminoBusqueda).subscribe({
        next: (data) => this.productosFiltrados = data,
        error: (error) => console.error('Error al buscar productos', error)
      });
    }
  }

  cargarDestacados(): void {
    this.productoService.obtenerDestacados().subscribe({
      next: (data) => this.productosFiltrados = data,
      error: (error) => console.error('Error al cargar destacados', error)
    });
  }

  cargarNuevos(): void {
    this.productoService.obtenerNuevos().subscribe({
      next: (data) => this.productosFiltrados = data,
      error: (error) => console.error('Error al cargar nuevos', error)
    });
  }

  cargarOfertas(): void {
    this.productoService.obtenerOfertas().subscribe({
      next: (data) => this.productosFiltrados = data,
      error: (error) => console.error('Error al cargar ofertas', error)
    });
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarItem({ productoId: producto.id!, cantidad: 1 }).subscribe({
      next: () => alert('Producto agregado al carrito'),
      error: (error) => console.error('Error al agregar al carrito', error)
    });
  }

  getProductImageUrl(producto: Producto): string {
    if (producto.imagenPrincipal) {
      // Si la URL ya es completa (http/https), usarla directamente
      if (producto.imagenPrincipal.startsWith('http')) {
        return producto.imagenPrincipal;
      }
      // Si es una ruta relativa, construir la URL con el backend
      return `${environment.apiUrl}${producto.imagenPrincipal}`;
    }
    // Usar imágenes locales de assets como respaldo
    // Asignar una imagen basada en el ID del producto (o aleatoria si no hay ID)
    const imageNumber = producto.id ? ((producto.id - 1) % 4) + 1 : Math.floor(Math.random() * 4) + 1;
    return `assets/images/products/p${imageNumber}.jpg`;
  }

  onImageError(event: any): void {
    // Si falla la carga de imagen del backend, intentar con imágenes locales
    const target = event.target as HTMLImageElement;
    if (!target.src.includes('assets/images/products/')) {
      // Si no es una imagen local, intentar con una imagen local aleatoria
      const imageNumber = Math.floor(Math.random() * 4) + 1;
      target.src = `assets/images/products/p${imageNumber}.jpg`;
    } else {
      // Si también falló la imagen local, usar placeholder SVG
      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3Ctext fill="rgba(0,0,0,0.5)" font-family="sans-serif" font-size="18" dy="10" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
    }
  }
}
