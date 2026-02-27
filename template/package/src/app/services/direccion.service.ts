import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Direccion {
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

@Injectable({
  providedIn: 'root'
})
export class DireccionService {
  private apiUrl = `${environment.apiUrl}/api/direcciones`;

  constructor(private http: HttpClient) { }

  obtenerMisDirecciones(): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Direccion> {
    return this.http.get<Direccion>(`${this.apiUrl}/${id}`);
  }

  obtenerPredeterminada(): Observable<Direccion> {
    return this.http.get<Direccion>(`${this.apiUrl}/predeterminada`);
  }

  crear(direccion: Direccion): Observable<Direccion> {
    return this.http.post<Direccion>(this.apiUrl, direccion);
  }

  actualizar(id: number, direccion: Direccion): Observable<Direccion> {
    return this.http.put<Direccion>(`${this.apiUrl}/${id}`, direccion);
  }

  establecerComoPredeterminada(id: number): Observable<Direccion> {
    return this.http.patch<Direccion>(`${this.apiUrl}/${id}/predeterminada`, null);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
