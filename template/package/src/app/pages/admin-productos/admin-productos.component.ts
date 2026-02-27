import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { ProductoService, Producto } from '../../services/producto.service';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.scss']
})
export class AdminProductosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'precio', 'stock', 'categoria', 'activo', 'destacado', 'acciones'];
  dataSource = new MatTableDataSource<Producto>([]);
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  productoForm: FormGroup;
  editando = false;
  productoEditando: Producto | null = null;
  mostrarFormulario = false;
  cargando = false;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      precioOferta: [0, Validators.min(0)],
      stock: [0, [Validators.required, Validators.min(0)]],
      sku: [''],
      peso: [0, Validators.min(0)],
      marca: [''],
      categoriaId: ['', Validators.required],
      activo: [true],
      destacado: [false]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.productoService.obtenerTodos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.dataSource.data = productos;
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al cargar productos');
        this.cargando = false;
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerTodas().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error) => {
        this.mostrarError('Error al cargar categorías');
      }
    });
  }

  nuevoProducto(): void {
    this.editando = false;
    this.productoEditando = null;
    this.productoForm.reset({
      activo: true,
      destacado: false,
      precio: 0,
      precioOferta: 0,
      stock: 0,
      peso: 0
    });
    this.mostrarFormulario = true;
  }

  editarProducto(producto: Producto): void {
    this.editando = true;
    this.productoEditando = producto;
    this.productoForm.patchValue(producto);
    this.mostrarFormulario = true;
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) {
      this.mostrarError('Por favor complete todos los campos requeridos');
      return;
    }

    this.cargando = true;
    const productoData = this.productoForm.value;

    if (this.editando && this.productoEditando?.id) {
      this.productoService.actualizar(this.productoEditando.id, productoData).subscribe({
        next: () => {
          this.mostrarExito('Producto actualizado exitosamente');
          this.cargarProductos();
          this.cancelar();
        },
        error: (error) => {
          this.mostrarError('Error al actualizar producto: ' + (error.error?.error || error.message));
          this.cargando = false;
        }
      });
    } else {
      this.productoService.crear(productoData).subscribe({
        next: () => {
          this.mostrarExito('Producto creado exitosamente');
          this.cargarProductos();
          this.cancelar();
        },
        error: (error) => {
          this.mostrarError('Error al crear producto: ' + (error.error?.error || error.message));
          this.cargando = false;
        }
      });
    }
  }

  eliminarProducto(producto: Producto): void {
    if (!producto.id) return;

    if (confirm(`¿Está seguro que desea eliminar el producto "${producto.nombre}"?`)) {
      this.cargando = true;
      this.productoService.eliminar(producto.id).subscribe({
        next: () => {
          this.mostrarExito('Producto eliminado exitosamente');
          this.cargarProductos();
        },
        error: (error) => {
          this.mostrarError('Error al eliminar producto: ' + (error.error?.error || error.message));
          this.cargando = false;
        }
      });
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.editando = false;
    this.productoEditando = null;
    this.productoForm.reset();
    this.cargando = false;
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snackbar-success']
    });
  }

  mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snackbar-error']
    });
  }
}
