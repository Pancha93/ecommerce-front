import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CarritoItem {
  id?: number;
  productoId: number;
  productoNombre: string;
  productoImagen?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  stockDisponible: number;
}

export interface Carrito {
  id?: number;
  usuarioId: number;
  items: CarritoItem[];
  total: number;
  cantidadItems: number;
  fechaActualizacion?: Date;
}

export interface AgregarAlCarritoRequest {
  productoId: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = `${environment.apiUrl}/api/carrito`;
  private carritoSubject = new BehaviorSubject<Carrito | null>(null);
  public carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient) { 
    this.cargarCarrito();
  }

  obtenerCarrito(): Observable<Carrito> {
    return this.http.get<Carrito>(this.apiUrl).pipe(
      tap(carrito => this.carritoSubject.next(carrito))
    );
  }

  agregarItem(request: AgregarAlCarritoRequest): Observable<Carrito> {
    return this.http.post<Carrito>(`${this.apiUrl}/items`, request).pipe(
      tap(carrito => this.carritoSubject.next(carrito))
    );
  }

  actualizarCantidad(productoId: number, cantidad: number): Observable<Carrito> {
    const params = new HttpParams().set('cantidad', cantidad.toString());
    return this.http.put<Carrito>(`${this.apiUrl}/items/${productoId}`, null, { params }).pipe(
      tap(carrito => this.carritoSubject.next(carrito))
    );
  }

  eliminarItem(productoId: number): Observable<Carrito> {
    return this.http.delete<Carrito>(`${this.apiUrl}/items/${productoId}`).pipe(
      tap(carrito => this.carritoSubject.next(carrito))
    );
  }

  limpiarCarrito(): Observable<void> {
    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => this.carritoSubject.next(null))
    );
  }

  cargarCarrito(): void {
    this.obtenerCarrito().subscribe({
      next: (carrito) => this.carritoSubject.next(carrito),
      error: () => this.carritoSubject.next(null)
    });
  }

  getCantidadItems(): number {
    const carrito = this.carritoSubject.value;
    return carrito ? carrito.cantidadItems : 0;
  }
}
