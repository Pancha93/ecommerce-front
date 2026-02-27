import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'Ocurrió un error inesperado';
        if (error.error?.message) {
          message = error.error.message;
        } else if (error.message) {
          message = error.message;
        }

        const token = localStorage.getItem('token');
        let isAdmin = false;
        if (token) {
          try {
            const decoded: any = jwtDecode(token);
            isAdmin = decoded && decoded.tieneRolNoAdministrador === false;
          } catch (e) {}
        }

        if (isAdmin && error.error?.backedMessage) {
          message += ' - ' + error.error.backedMessage;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--colorBoton)',
          timer: isAdmin ? undefined : 3000,
          timerProgressBar: !isAdmin
        });

        if (error.status === 401) {
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
