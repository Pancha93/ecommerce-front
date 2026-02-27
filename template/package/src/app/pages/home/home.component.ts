import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto } from '../../services/producto.service';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  productosDestacados: Producto[] = [];
  productosNuevos: Producto[] = [];
  productosOfertas: Producto[] = [];
  categorias: Categoria[] = [];

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarProductosDestacados();
    this.cargarProductosNuevos();
    this.cargarProductosOfertas();
    this.cargarCategorias();
  }

  cargarProductosDestacados(): void {
    this.productoService.obtenerDestacados().subscribe({
      next: (data) => this.productosDestacados = data.slice(0, 4),
      error: (error) => console.error('Error al cargar destacados', error)
    });
  }

  cargarProductosNuevos(): void {
    this.productoService.obtenerNuevos().subscribe({
      next: (data) => this.productosNuevos = data.slice(0, 4),
      error: (error) => console.error('Error al cargar nuevos', error)
    });
  }

  cargarProductosOfertas(): void {
    this.productoService.obtenerOfertas().subscribe({
      next: (data) => this.productosOfertas = data.slice(0, 4),
      error: (error) => console.error('Error al cargar ofertas', error)
    });
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerActivas().subscribe({
      next: (data) => this.categorias = data.slice(0, 6),
      error: (error) => console.error('Error al cargar categorías', error)
    });
  }

  irATienda(): void {
    this.router.navigate(['/tienda']);
  }

  irACategoria(categoriaId: number): void {
    this.router.navigate(['/tienda'], { queryParams: { categoria: categoriaId } });
  }

  verDetalle(productoId: number): void {
    this.router.navigate(['/producto', productoId]);
  }

  agregarAlCarrito(producto: Producto, event: Event): void {
    event.stopPropagation();
    this.carritoService.agregarItem({ productoId: producto.id!, cantidad: 1 }).subscribe({
      next: () => alert('Producto agregado al carrito'),
      error: (error) => console.error('Error al agregar al carrito', error)
    });
  }
}
