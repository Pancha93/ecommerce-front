import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  imagenUrl?: string;
  activo?: boolean;
  fechaCreacion?: Date;
  cantidadProductos?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}/api/categorias`;

  constructor(private http: HttpClient) { }

  obtenerTodas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  obtenerActivas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/activas`);
  }

  obtenerPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  crear(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  actualizar(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
