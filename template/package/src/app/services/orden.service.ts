import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DireccionDTO {
  id?: number;
  usuarioId?: number;
  nombreCompleto: string;
  telefono: string;
  direccionLinea1: string;
  direccionLinea2?: string;
  ciudad: string;
  estadoProvincia: string;
  codigoPostal: string;
  pais: string;
  esPredeterminada?: boolean;
  fechaCreacion?: Date;
}

export interface OrdenItem {
  id?: number;
  productoId: number;
  productoNombre: string;
  productoImagen?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Orden {
  id?: number;
  numeroOrden?: string;
  usuarioId?: number;
  usuarioNombre?: string;
  estado: string;
  subtotal: number;
  costoEnvio: number;
  impuestos: number;
  total: number;
  metodoPago?: string;
  notas?: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  direccionEnvio?: DireccionDTO;
  items: OrdenItem[];
}

export interface CrearOrdenRequest {
  direccionEnvioId?: number;
  metodoPago: string;
  notas?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private apiUrl = `${environment.apiUrl}/api/ordenes`;

  constructor(private http: HttpClient) { }

  obtenerMisOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(this.apiUrl);
  }

  obtenerTodas(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/todas`);
  }

  obtenerPorId(id: number): Observable<Orden> {
    return this.http.get<Orden>(`${this.apiUrl}/${id}`);
  }

  obtenerPorNumero(numeroOrden: string): Observable<Orden> {
    return this.http.get<Orden>(`${this.apiUrl}/numero/${numeroOrden}`);
  }

  obtenerPorEstado(estado: string): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/estado/${estado}`);
  }

  crearOrden(request: CrearOrdenRequest): Observable<Orden> {
    return this.http.post<Orden>(this.apiUrl, request);
  }

  actualizarEstado(id: number, estado: string): Observable<Orden> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<Orden>(`${this.apiUrl}/${id}/estado`, null, { params });
  }
}
