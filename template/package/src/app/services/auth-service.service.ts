import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from "../../environments/environment";
import { jwtDecode } from "jwt-decode";
import {logout} from './dataLogout';

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.baseUrl;
  private router = inject(Router);
  private rutaLogout = logout;

  constructor(private http: HttpClient) {}

  // Método para autenticar al usuario (login básico)
  login(username: string, password: string): Observable<LoginResponse> {
    const body = { username, password };

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/authenticate`, body).pipe(
      tap((response: LoginResponse): void => {
        if (response.success) {
          console.log('Usuario autenticado exitosamente:', response);
          // Assuming the token is in response.data.token, adjust as needed
          if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
        } else {
          console.error('Error: Autenticación fallida');
        }
      }),
      catchError((error): Observable<never> => {
        console.error('Error de autenticación:', error);
        return throwError(() => error);
      })
    );
  }

  // Get the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Decode the token and get user information
  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Get username from the token
  getUsername(): string {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) return '';

    // 'sub' contains the username in your JWT token structure
    return decodedToken.sub || '';
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('token');
    this.router.navigate([this.rutaLogout]);
  }
}
