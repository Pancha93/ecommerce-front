// Importaciones de Angular core y HTTP
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

/**
 * Interfaz que define la estructura de la entidad ConfiguracionApi
 */
export interface ConfiguracionApi {
}

/**
 * Interfaz que define la estructura del DTO para ConfiguracionApi
 * Utilizada para la transferencia de datos entre el frontend y backend
 */
export interface ConfiguracionApiDTO {
}

/**
 * Servicio que maneja las operaciones CRUD y otras funcionalidades
 * relacionadas con la entidad ConfiguracionApi
 */
@Injectable({
  providedIn: 'root'  // El servicio está disponible en toda la aplicación
})
export class ConfiguracionApiService {
  /** URL base para las peticiones al backend */
  private baseUrl = environment.baseUrlApi;

  /**
   * Constructor del servicio
   * @param httpClient Cliente HTTP de Angular para realizar peticiones
   */
  constructor(private httpClient: HttpClient) {}

  // Método para obtener todos los registros
  findAll(): Observable<ConfiguracionApi[]> {
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'ConfiguracionApi');
    const url = `${this.baseUrl}/configuracionapis`;
    return this.httpClient.get<ConfiguracionApi[]>(url, {headers});
  }

  // Método para buscar un registro por su ID
  findById(id: number): Observable<ConfiguracionApi> {
    const url = `${this.baseUrl}/configuracionapis/${id}`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'findById').set('Objeto', 'ConfiguracionApi')
    };
    return this.httpClient.get<ConfiguracionApi>(url, options);
  }

  // Método para save
  save(configuracion: any): Observable<ConfiguracionApi> {
    const url = `${this.baseUrl}/configuracionapis`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'save').set('Objeto', 'ConfiguracionApi')
    };
    return this.httpClient.post<ConfiguracionApi>(url, configuracion, options);
  }

  // Método para actualizar un registro existente
  update(id: number, configuracion: any): Observable<ConfiguracionApi> {
    const url = `${this.baseUrl}/configuracionapis/${id}`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'update').set('Objeto', 'ConfiguracionApi')
    };
    return this.httpClient.put<ConfiguracionApi>(url, configuracion, options);
  }

  // Método para deleteById
  deleteById(id: number): Observable<void> {
    const url = `${this.baseUrl}/configuracionapis/${id}`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'deleteById').set('Objeto', 'ConfiguracionApi')
    };
    return this.httpClient.delete<void>(url, options);
  }

  // Método para findActivas
  findActivas(): Observable<ConfiguracionApi[]> {
    const url = `${this.baseUrl}/configuracionapis/activas`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'findActivas').set('Objeto', 'ConfiguracionApi')
    };
    return this.httpClient.get<ConfiguracionApi[]>(url, options);
  }

  // Método para findByEntidadAsociada
  findByEntidadAsociada(entidadAsociada: string): Observable<ConfiguracionApi[]> {
    const url = `${this.baseUrl}/configuracionapis/entidad/${entidadAsociada}`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'findByEntidadAsociada').set('Objeto', 'ConfiguracionApi')
    };
    return this.httpClient.get<ConfiguracionApi[]>(url, options);
  }

  // Método para findConfiguracionesConAutenticacion
  findConfiguracionesConAutenticacion(): Observable<ConfiguracionApi[]> {
    const url = `${this.baseUrl}/configuracionapis/con-autenticacion`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'findConfiguracionesConAutenticacion').set('Objeto', 'ConfiguracionApi')
    };
    return this.httpClient.get<ConfiguracionApi[]>(url, options);
  }

  // Método para findByNombre
  findByNombre(nombre: string): Observable<ConfiguracionApi[]> {
    const url = `${this.baseUrl}/configuracionapis/buscar`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'findByNombre').set('Objeto', 'ConfiguracionApi'),
      params: new HttpParams().set('nombre', nombre.toString())
    };
    return this.httpClient.get<ConfiguracionApi[]>(url, options);
  }

  // Método para existsByUrlBase
  existsByUrlBase(urlBase: string): Observable<ConfiguracionApi> {
    const url = `${this.baseUrl}/configuracionapis/existe-url`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'existsByUrlBase').set('Objeto', 'ConfiguracionApi'),
      params: new HttpParams().set('urlBase', urlBase.toString())
    };
    return this.httpClient.get<ConfiguracionApi>(url, options);
  }

  // Método para countActivas
  countActivas(): Observable<ConfiguracionApi> {
    const url = `${this.baseUrl}/configuracionapis/contar-activas`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'countActivas').set('Objeto', 'ConfiguracionApi')
    };
    return this.httpClient.get<ConfiguracionApi>(url, options);
  }

}
