import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private readonly excludedUrls: string[] = [
    '/auth/authenticate',
    '/auth/crearUsuario'
  ];

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Comprueba si la URL está en la lista de URLs excluidas
    const isExcluded = this.excludedUrls.some(url => request.url.includes(url));

    if (isExcluded) {
      // Si la URL está excluida, simplemente pasa la solicitud sin modificarla
      return next.handle(request);
    }

    // Si no está excluida, agrega el token al encabezado
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
