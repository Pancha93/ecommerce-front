import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    console.log('AuthGuard: Verificando token...'); // Debug log
    const token = localStorage.getItem('token');
    console.log('Token encontrado:', !!token); // Debug log

    if (token) {
      return true;
    }

    console.log('No hay token, redirigiendo a login'); // Debug log
    this.router.navigate(['/authentication/login']);
    return false;
  }
}

