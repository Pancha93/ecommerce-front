// Importaciones de Angular core y HTTP
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

/**
 * Interfaz que define la estructura de la entidad Ordenlaboratorio
 */
export interface Ordenlaboratorio {
  /** nombre - Campo de texto */
  nombre: string;
  /** record - Campo de texto */
  record: string;
  /** rx - Campo de texto */
  rx: string;
  /** piezas - Campo numérico entero */
  piezas: number;
  /** shade - Campo de texto */
  shade: string;
  /** lab - Campo de texto */
  lab: string;
  /** fechaEnvio - Campo de tipo LocalDate */
  fechaEnvio: Date;
  /** fechaEntrega - Campo de tipo LocalDate */
  fechaEntrega: Date;
  /** factura - Campo de texto */
  factura: string;
  /** monto - Campo numérico decimal */
  monto: number;
  /** pay - Campo de texto */
  pay: string;
  /** cheque - Campo de texto */
  cheque: string;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Interfaz que define la estructura del DTO para Ordenlaboratorio
 * Utilizada para la transferencia de datos entre el frontend y backend
 */
export interface OrdenlaboratorioDTO {
  /** nombre - Campo de texto */
  nombre: string;
  /** record - Campo de texto */
  record: string;
  /** rx - Campo de texto */
  rx: string;
  /** piezas - Campo numérico entero */
  piezas: number;
  /** shade - Campo de texto */
  shade: string;
  /** lab - Campo de texto */
  lab: string;
  /** fechaEnvio - Campo de tipo LocalDate */
  fechaEnvio: Date;
  /** fechaEntrega - Campo de tipo LocalDate */
  fechaEntrega: Date;
  /** factura - Campo de texto */
  factura: string;
  /** monto - Campo numérico decimal */
  monto: number;
  /** pay - Campo de texto */
  pay: string;
  /** cheque - Campo de texto */
  cheque: string;
  /** creador - Campo de texto */
  creador: string;
}

/**
 * Servicio que maneja las operaciones CRUD y otras funcionalidades
 * relacionadas con la entidad Ordenlaboratorio
 */
@Injectable({
  providedIn: 'root'  // El servicio está disponible en toda la aplicación
})
export class OrdenlaboratorioService {
  /** URL base para las peticiones al backend */
  private baseUrl = environment.baseUrlApi;

  /**
   * Constructor del servicio
   * @param httpClient Cliente HTTP de Angular para realizar peticiones
   */
  constructor(private httpClient: HttpClient) {}

  // Método para obtener todos los registros
  findAll(): Observable<Ordenlaboratorio[]> {
    const headers = new HttpHeaders().set('Accion', 'findAll').set('Objeto', 'Ordenlaboratorio');
    const url = `${this.baseUrl}/ordenlaboratorios`;
    return this.httpClient.get<Ordenlaboratorio[]>(url, {headers});
  }

  // Método para buscar un registro por su ID
  findById(id: number): Observable<Ordenlaboratorio> {
    const url = `${this.baseUrl}/ordenlaboratorios/${id}`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'findById').set('Objeto', 'Ordenlaboratorio')
    };
    return this.httpClient.get<Ordenlaboratorio>(url, options);
  }

  // Método para save
  save(dto: OrdenlaboratorioDTO): Observable<Ordenlaboratorio> {
    const url = `${this.baseUrl}/ordenlaboratorios`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'save').set('Objeto', 'Ordenlaboratorio')
    };
    return this.httpClient.post<Ordenlaboratorio>(url, dto, options);
  }

  // Método para actualizar un registro existente
  update(id: number, dto: OrdenlaboratorioDTO): Observable<Ordenlaboratorio> {
    const url = `${this.baseUrl}/ordenlaboratorios/${id}`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'update').set('Objeto', 'Ordenlaboratorio')
    };
    return this.httpClient.put<Ordenlaboratorio>(url, dto, options);
  }

  // Método para deleteById
  deleteById(id: number): Observable<void> {
    const url = `${this.baseUrl}/ordenlaboratorios/${id}`;
    const options = {
      headers: new HttpHeaders().set('Accion', 'deleteById').set('Objeto', 'Ordenlaboratorio')
    };
    return this.httpClient.delete<void>(url, options);
  }

}
