import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProductoImagen {
  id?: number;
  url: string;
  esPrincipal: boolean;
  orden: number;
}

export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  precioOferta?: number;
  stock: number;
  sku?: string;
  peso?: number;
  marca?: string;
  activo?: boolean;
  destacado?: boolean;
  fechaCreacion?: Date;
  categoriaId?: number;
  categoriaNombre?: string;
  imagenes?: ProductoImagen[];
  imagenPrincipal?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/api/productos`;

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  obtenerActivos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/activos`);
  }

  obtenerDestacados(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/destacados`);
  }

  obtenerNuevos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/nuevos`);
  }

  obtenerOfertas(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/ofertas`);
  }

  obtenerPorCategoria(categoriaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/categoria/${categoriaId}`);
  }

  buscar(termino: string): Observable<Producto[]> {
    const params = new HttpParams().set('q', termino);
    return this.http.get<Producto[]>(`${this.apiUrl}/buscar`, { params });
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  crear(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  actualizar(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
