import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProductoService, Producto } from '../../services/producto.service';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth-service.service';
import { ProductoModalComponent } from './producto-modal.component';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tienda.component.html',
  styles: [`
    .card { 
      transition: transform 0.2s; 
    }
    .card:hover { 
      transform: translateY(-5px); 
      box-shadow: 0 4px 8px rgba(0,0,0,0.2); 
    }
    .card.border-danger {
      border: 2px solid #dc3545 !important;
      background-color: #fff5f5;
    }
    .badge {
      font-size: 0.75rem;
      padding: 0.4rem 0.6rem;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
  `]
})
export class TiendaComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];
  categoriaSeleccionada: number | null = null;
  terminoBusqueda: string = '';
  esAdmin: boolean = false;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private carritoService: CarritoService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.esAdmin = this.authService.isAdmin();
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerActivas().subscribe({
      next: (data) => this.categorias = data,
      error: (error) => console.error('Error al cargar categorías', error)
    });
  }

  cargarProductos(): void {
    // Si es admin, cargar todos los productos (incluyendo inactivos)
    const observable = this.esAdmin 
      ? this.productoService.obtenerTodos() 
      : this.productoService.obtenerActivos();
      
    observable.subscribe({
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
      error: (error) => {
        console.error('Error al agregar al carrito', error);
        alert('Error al agregar al carrito: ' + (error.error?.error || error.message));
      }
    });
  }

  getProductImageUrl(producto: Producto): string {
    // Usar imágenes locales rotando entre las 4 disponibles
    const imageNumber = producto.id ? ((producto.id - 1) % 4) + 1 : 1;
    return `assets/images/products/p${imageNumber}.jpg`;
  }

  // ============= FUNCIONES DE ADMINISTRACIÓN =============
  
  abrirModalProducto(producto: Producto | null): void {
    const dialogRef = this.dialog.open(ProductoModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        producto: producto,
        categorias: this.categorias
      },
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarProducto(producto, result);
      }
    });
  }

  guardarProducto(producto: Producto | null, productoData: any): void {
    const data = {
      ...productoData,
      precioOferta: productoData.precioOferta || null,
      peso: productoData.peso || null
    };

    if (producto && producto.id) {
      // Actualizar producto existente
      this.productoService.actualizar(producto.id, data).subscribe({
        next: () => {
          alert('Producto actualizado exitosamente');
          this.cargarProductos();
          this.cargarCategorias(); // Actualizar contador de categorías
        },
        error: (error) => {
          console.error('Error al actualizar producto', error);
          alert('Error al actualizar producto: ' + (error.error?.error || error.message));
        }
      });
    } else {
      // Crear nuevo producto
      this.productoService.crear(data).subscribe({
        next: () => {
          alert('Producto creado exitosamente');
          this.cargarProductos();
          this.cargarCategorias(); // Actualizar contador de categorías
        },
        error: (error) => {
          console.error('Error al crear producto', error);
          alert('Error al crear producto: ' + (error.error?.error || error.message));
        }
      });
    }
  }

  eliminarProducto(producto: Producto): void {
    if (!producto.id) return;

    if (confirm(`¿Está seguro que desea eliminar el producto "${producto.nombre}"?`)) {
      this.productoService.eliminar(producto.id).subscribe({
        next: () => {
          alert('Producto eliminado exitosamente');
          this.cargarProductos();
          this.cargarCategorias(); // Actualizar contador de categorías
        },
        error: (error) => {
          console.error('Error al eliminar producto', error);
          alert('Error al eliminar producto: ' + (error.error?.error || error.message));
        }
      });
    }
  }
}
