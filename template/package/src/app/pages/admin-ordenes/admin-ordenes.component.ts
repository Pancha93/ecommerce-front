import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { OrdenService, Orden } from '../../services/orden.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-ordenes',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './admin-ordenes.component.html',
  styleUrls: ['./admin-ordenes.component.scss']
})
export class AdminOrdenesComponent implements OnInit {
  displayedColumns: string[] = ['numeroOrden', 'fecha', 'cliente', 'items', 'total', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Orden>([]);
  ordenes: Orden[] = [];
  cargando = false;
  
  estadosDisponibles = [
    { valor: 'PENDIENTE', etiqueta: 'Pendiente', color: 'warn' },
    { valor: 'CONFIRMADA', etiqueta: 'Confirmada', color: 'accent' },
    { valor: 'PROCESANDO', etiqueta: 'Procesando', color: 'primary' },
    { valor: 'ENVIADA', etiqueta: 'Enviada', color: 'primary' },
    { valor: 'ENTREGADA', etiqueta: 'Entregada', color: 'accent' },
    { valor: 'CANCELADA', etiqueta: 'Cancelada', color: 'warn' },
    { valor: 'DEVUELTA', etiqueta: 'Devuelta', color: 'warn' }
  ];

  ordenSeleccionada: Orden | null = null;
  mostrarDetalles = false;

  constructor(
    private ordenService: OrdenService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes(): void {
    this.cargando = true;
    this.ordenService.obtenerTodas().subscribe({
      next: (ordenes) => {
        this.ordenes = ordenes;
        this.dataSource.data = ordenes;
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al cargar órdenes: ' + (error.error?.error || error.message));
        this.cargando = false;
      }
    });
  }

  verDetalles(orden: Orden): void {
    this.ordenSeleccionada = orden;
    this.mostrarDetalles = true;
  }

  cerrarDetalles(): void {
    this.mostrarDetalles = false;
    this.ordenSeleccionada = null;
  }

  cambiarEstado(orden: Orden, nuevoEstado: string): void {
    if (!orden.id) return;

    if (confirm(`¿Está seguro que desea cambiar el estado de la orden ${orden.numeroOrden} a "${nuevoEstado}"?`)) {
      this.cargando = true;
      this.ordenService.actualizarEstado(orden.id, nuevoEstado).subscribe({
        next: (ordenActualizada) => {
          this.mostrarExito('Estado actualizado exitosamente');
          this.cargarOrdenes();
        },
        error: (error) => {
          this.mostrarError('Error al actualizar estado: ' + (error.error?.error || error.message));
          this.cargando = false;
        }
      });
    }
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filtrarPorEstado(estado: string): void {
    if (estado === 'TODAS') {
      this.dataSource.data = this.ordenes;
    } else {
      this.dataSource.data = this.ordenes.filter(orden => orden.estado === estado);
    }
  }

  obtenerColorEstado(estado: string): string {
    const estadoEncontrado = this.estadosDisponibles.find(e => e.valor === estado);
    return estadoEncontrado?.color || 'primary';
  }

  obtenerEtiquetaEstado(estado: string): string {
    const estadoEncontrado = this.estadosDisponibles.find(e => e.valor === estado);
    return estadoEncontrado?.etiqueta || estado;
  }

  formatearFecha(fecha: Date | undefined): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calcularTotalItems(orden: Orden): number {
    return orden.items?.reduce((sum, item) => sum + item.cantidad, 0) || 0;
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
