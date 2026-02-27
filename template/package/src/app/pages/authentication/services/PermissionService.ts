import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";
import {environment} from "../../../../environments/environment";




@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private baseUrl = environment.baseUrl;
  private clientId = environment.githubClientId;
  private redirectUri = environment.redirectUri;

  constructor(private httpClient: HttpClient) {}

  save(dto: any): Observable<any> {
    const url = `${this.baseUrl}/auth/crearRol`;
    return this.httpClient.post<any>(url, dto);
  }

  getRoles(): Observable<any> {
    const headers = new HttpHeaders().set('Accion', 'ver').set('Objeto', 'Permisos');
    const url = `${this.baseUrl}/auth/getRoles`;
    return this.httpClient.get<any>(url, {headers});
  }

  getPermisos(): Observable<any> {
    const url = `${this.baseUrl}/permissions/getPermisos`;
    return this.httpClient.get<any>(url);
  }

  createOne(dto: any): Observable<any> {
    const url = `${this.baseUrl}/permissions`;
    return this.httpClient.post<any>(url, dto);
  }

  findAll(): Observable<any> {
    const url = `${this.baseUrl}/permissions`;
    return this.httpClient.get<any>(url);
  }

  deleteOneById(id:number): Observable<any> {
    const url = `${this.baseUrl}/permissions/${id}`;
    return this.httpClient.delete<any>(url);
  }

  asignarRol(dto: any): Observable<any> {
    const headers = new HttpHeaders().set('Accion', 'ver').set('Objeto', 'Permisos');
    const url = `${this.baseUrl}/auth/asignarRol`;
    return this.httpClient.post<any>(url, dto, {headers});
  }

  agregarRol(dto: any): Observable<any> {
    const headers = new HttpHeaders().set('Accion', 'ver').set('Objeto', 'Permisos');
    const url = `${this.baseUrl}/auth/agregarRol`;
    return this.httpClient.post<any>(url, dto, {headers});
  }

  getUsers(): Observable<any> {
    const headers = new HttpHeaders().set('Accion', 'ver').set('Objeto', 'Permisos');
    const url = `${this.baseUrl}/auth/getUsers`;
    return this.httpClient.get<any>(url, {headers});
  }

  getObjetos(tipoObjeto:string): Observable<any> {
    const url = `${this.baseUrl}/auth/buscarObjeto?tipoObjeto=${tipoObjeto}`;
    return this.httpClient.get<any>(url);
  }

  crearRol(rol: any): Observable<any> {
    const headers = new HttpHeaders().set('Accion', 'ver').set('Objeto', 'Permisos');
    const url = `${this.baseUrl}/auth/crearRol`;
    return this.httpClient.post<any>(url, rol, {headers});
  }

  getPermisosByRolAndUser(rolId: number, usuarioId: number): Observable<any> {
    const headers = new HttpHeaders().set('Accion', 'ver').set('Objeto', 'Permisos');
    const url = `${this.baseUrl}/auth/permisos?rolID=${rolId}&usuarioID=${usuarioId}`;
    return this.httpClient.get<any>(url, {headers})

      .pipe(
        catchError(error => {
          console.error('Error en getPermisosByRolAndUser:', error);
          return throwError(() => error);
        })
      );
  }

  actualizarPrivilegio(dto: any): Observable<any> {
    const headers = new HttpHeaders().set('Accion', 'ver').set('Objeto', 'Permisos');
    const url = `${this.baseUrl}/auth/actualizarPrivilegio`;
    return this.httpClient.post<any>(url, dto, {headers});
  }

  quitarRol(usuarioId: number, rolId: number): Observable<any> {
    const headers = new HttpHeaders().set('Accion', 'ver').set('Objeto', 'Usuarios');
    const url = `${this.baseUrl}/auth/quitarRol?usuarioId=${usuarioId}&rolId=${rolId}`;
    return this.httpClient.delete<any>(url, { headers });
  }

  quitarRolHijo(rolPadreId: number, rolHijoId: number): Observable<any> {
    const headers = new HttpHeaders().set('Accion', 'ver').set('Objeto', 'Permisos');
    const url = `${this.baseUrl}/auth/quitarRolHijo?rolPadreId=${rolPadreId}&rolHijoId=${rolHijoId}`;
    return this.httpClient.delete<any>(url, { headers });
  }

  eliminarUsuario(usuarioId: number): Observable<void> {
    const headers = new HttpHeaders().set('Accion', 'ver').set('Objeto', 'Permisos');
    const url = `${this.baseUrl}/auth/eliminarUsuario?usuarioId=${usuarioId}`;
    return this.httpClient.delete<any>(url, { headers });
  }

  eliminarRolPadre(rolPadreId: number): Observable<void> {
    const headers = new HttpHeaders().set('Accion', 'ver').set('Objeto', 'Permisos');
    const url = `${this.baseUrl}/auth/eliminarRolPadre?rolPadreId=${rolPadreId}`;
    return this.httpClient.delete<any>(url, { headers });
  }

  verificarCorreoExistente(correo: string) {
    const url = `${this.baseUrl}/auth/verificar-correo`;
    return this.httpClient.post<any>(url, { correo });
  }

  loginWithGitHub() {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=user`;
  }

  exchangeCodeForToken(code: string) {
    return this.httpClient.post<{ access_token: string }>(environment.baseUrlGitHub, code);

  }
}


