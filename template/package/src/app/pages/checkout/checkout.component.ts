import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService, Carrito } from '../../services/carrito.service';
import { OrdenService, CrearOrdenRequest } from '../../services/orden.service';
import { DireccionService, Direccion } from '../../services/direccion.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <h2 class="mb-4">Finalizar Compra</h2>

      <div class="row" *ngIf="carrito && carrito.items.length > 0">
        <div class="col-md-8">
          <!-- Dirección de Envío -->
          <div class="card mb-3">
            <div class="card-header">
              <h5>Dirección de Envío</h5>
            </div>
            <div class="card-body">
              <div *ngIf="direcciones.length > 0">
                <div class="form-check" *ngFor="let direccion of direcciones">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    [id]="'dir-' + direccion.id"
                    [value]="direccion.id"
                    [(ngModel)]="direccionSeleccionada">
                  <label class="form-check-label" [for]="'dir-' + direccion.id">
                    <strong>{{ direccion.nombreCompleto }}</strong><br>
                    {{ direccion.direccionLinea1 }}<br>
                    <span *ngIf="direccion.direccionLinea2">{{ direccion.direccionLinea2 }}<br></span>
                    {{ direccion.ciudad }}, {{ direccion.estadoProvincia }} {{ direccion.codigoPostal }}<br>
                    {{ direccion.pais }}<br>
                    Tel: {{ direccion.telefono }}
                    <span class="badge bg-primary ms-2" *ngIf="direccion.esPredeterminada">Predeterminada</span>
                  </label>
                </div>
              </div>
              <div *ngIf="direcciones.length === 0">
                <p class="text-muted">No tienes direcciones guardadas</p>
                <button class="btn btn-primary btn-sm" (click)="mostrarFormularioDireccion = true">
                  Agregar Dirección
                </button>
              </div>

              <!-- Formulario Nueva Dirección -->
              <div *ngIf="mostrarFormularioDireccion" class="mt-3">
                <h6>Nueva Dirección</h6>
                <div class="row">
                  <div class="col-md-6 mb-2">
                    <input type="text" class="form-control" placeholder="Nombre Completo" [(ngModel)]="nuevaDireccion.nombreCompleto">
                  </div>
                  <div class="col-md-6 mb-2">
                    <input type="text" class="form-control" placeholder="Teléfono" [(ngModel)]="nuevaDireccion.telefono">
                  </div>
                  <div class="col-12 mb-2">
                    <input type="text" class="form-control" placeholder="Dirección Línea 1" [(ngModel)]="nuevaDireccion.direccionLinea1">
                  </div>
                  <div class="col-12 mb-2">
                    <input type="text" class="form-control" placeholder="Dirección Línea 2 (Opcional)" [(ngModel)]="nuevaDireccion.direccionLinea2">
                  </div>
                  <div class="col-md-6 mb-2">
                    <input type="text" class="form-control" placeholder="Ciudad" [(ngModel)]="nuevaDireccion.ciudad">
                  </div>
                  <div class="col-md-6 mb-2">
                    <input type="text" class="form-control" placeholder="Estado/Provincia" [(ngModel)]="nuevaDireccion.estadoProvincia">
                  </div>
                  <div class="col-md-6 mb-2">
                    <input type="text" class="form-control" placeholder="Código Postal" [(ngModel)]="nuevaDireccion.codigoPostal">
                  </div>
                  <div class="col-md-6 mb-2">
                    <input type="text" class="form-control" placeholder="País" [(ngModel)]="nuevaDireccion.pais">
                  </div>
                </div>
                <button class="btn btn-success btn-sm" (click)="guardarDireccion()">Guardar</button>
                <button class="btn btn-secondary btn-sm ms-2" (click)="mostrarFormularioDireccion = false">Cancelar</button>
              </div>
            </div>
          </div>

          <!-- Método de Pago -->
          <div class="card mb-3">
            <div class="card-header">
              <h5>Método de Pago</h5>
            </div>
            <div class="card-body">
              <div class="form-check">
                <input class="form-check-input" type="radio" id="efectivo" value="efectivo" [(ngModel)]="metodoPago">
                <label class="form-check-label" for="efectivo">Efectivo contra entrega</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="tarjeta" value="tarjeta" [(ngModel)]="metodoPago">
                <label class="form-check-label" for="tarjeta">Tarjeta de crédito/débito</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="transferencia" value="transferencia" [(ngModel)]="metodoPago">
                <label class="form-check-label" for="transferencia">Transferencia bancaria</label>
              </div>
            </div>
          </div>

          <!-- Notas -->
          <div class="card mb-3">
            <div class="card-header">
              <h5>Notas del Pedido (Opcional)</h5>
            </div>
            <div class="card-body">
              <textarea class="form-control" rows="3" [(ngModel)]="notas" placeholder="Instrucciones especiales para la entrega..."></textarea>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <!-- Resumen del Pedido -->
          <div class="card">
            <div class="card-header">
              <h5>Resumen del Pedido</h5>
            </div>
            <div class="card-body">
              <div *ngFor="let item of carrito.items" class="mb-2">
                <div class="d-flex justify-content-between">
                  <span>{{ item.productoNombre }} x {{ item.cantidad }}</span>
                  <strong>\${{ item.subtotal }}</strong>
                </div>
              </div>
              <hr>
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>\${{ carrito.total }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <strong>Gratis</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>IVA (16%):</span>
                <strong>\${{ calcularIVA() }}</strong>
              </div>
              <hr>
              <div class="d-flex justify-content-between mb-3">
                <h5>Total:</h5>
                <h5 class="text-primary">\${{ calcularTotal() }}</h5>
              </div>
              <div class="d-grid">
                <button 
                  class="btn btn-primary btn-lg" 
                  (click)="confirmarPedido()"
                  [disabled]="!direccionSeleccionada || !metodoPago || procesando">
                  <span *ngIf="!procesando">Confirmar Pedido</span>
                  <span *ngIf="procesando">Procesando...</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!carrito || carrito.items.length === 0" class="text-center py-5">
        <h3>Tu carrito está vacío</h3>
        <button class="btn btn-primary" [routerLink]="['/tienda']">Ir a la Tienda</button>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  carrito: Carrito | null = null;
  direcciones: Direccion[] = [];
  direccionSeleccionada: number | undefined;
  metodoPago: string = 'efectivo';
  notas: string = '';
  procesando: boolean = false;
  mostrarFormularioDireccion: boolean = false;
  nuevaDireccion: Direccion = {
    nombreCompleto: '',
    telefono: '',
    direccionLinea1: '',
    ciudad: '',
    estadoProvincia: '',
    codigoPostal: '',
    pais: 'México'
  };

  constructor(
    private carritoService: CarritoService,
    private ordenService: OrdenService,
    private direccionService: DireccionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarCarrito();
    this.cargarDirecciones();
  }

  cargarCarrito(): void {
    this.carritoService.obtenerCarrito().subscribe({
      next: (data) => this.carrito = data,
      error: (error) => console.error('Error al cargar carrito', error)
    });
  }

  cargarDirecciones(): void {
    this.direccionService.obtenerMisDirecciones().subscribe({
      next: (data) => {
        this.direcciones = data;
        const predeterminada = data.find(d => d.esPredeterminada);
        if (predeterminada) {
          this.direccionSeleccionada = predeterminada.id;
        }
      },
      error: (error) => console.error('Error al cargar direcciones', error)
    });
  }

  guardarDireccion(): void {
    this.direccionService.crear(this.nuevaDireccion).subscribe({
      next: (data) => {
        this.direcciones.push(data);
        this.direccionSeleccionada = data.id;
        this.mostrarFormularioDireccion = false;
        alert('Dirección guardada exitosamente');
      },
      error: (error) => console.error('Error al guardar dirección', error)
    });
  }

  calcularIVA(): number {
    return this.carrito ? Number((this.carrito.total * 0.16).toFixed(2)) : 0;
  }

  calcularTotal(): number {
    return this.carrito ? Number((this.carrito.total + this.calcularIVA()).toFixed(2)) : 0;
  }

  confirmarPedido(): void {
    if (!this.direccionSeleccionada || !this.metodoPago) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.procesando = true;
    const request: CrearOrdenRequest = {
      direccionEnvioId: this.direccionSeleccionada,
      metodoPago: this.metodoPago,
      notas: this.notas
    };

    this.ordenService.crearOrden(request).subscribe({
      next: (orden) => {
        // Limpiar el carrito después de crear la orden exitosamente
        this.carritoService.limpiarCarrito().subscribe({
          next: () => {
            alert('¡Pedido realizado exitosamente! Número de orden: ' + orden.numeroOrden);
            this.router.navigate(['/mis-ordenes']);
          },
          error: (error) => {
            console.error('Error al limpiar carrito', error);
            // Aún así redirigir al usuario, aunque el carrito no se limpió
            alert('¡Pedido realizado exitosamente! Número de orden: ' + orden.numeroOrden);
            this.router.navigate(['/mis-ordenes']);
          }
        });
      },
      error: (error) => {
        console.error('Error al crear orden', error);
        alert('Error al procesar el pedido. Por favor intenta nuevamente.');
        this.procesando = false;
      }
    });
  }
}
