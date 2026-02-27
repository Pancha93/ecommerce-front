import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from "@angular/router";
import { AuthService } from "../../../../services/auth-service.service";
import Swal from 'sweetalert2';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-tradicional',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './login-tradicional.component.html',
  styleUrls: ['./login-tradicional.component.scss']
})
export class LoginTradicionalComponent {
  form: FormGroup;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.form = new FormGroup({
      uname: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos correctamente.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'var(--colorBoton)',
      });
      return;
    }

    const { uname, password } = this.form.value;
    if (uname && password) {
      this.authService.login(uname, password).subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('permisos', response.permisos);

          Swal.fire({
            title: '¡Inicio de sesión exitoso!',
            text: 'Redirigiendo al inicio...',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: 'var(--colorBoton)',
          }).then(() => {
            this.router.navigate(['/inicio']);
          });
        },
        error: (error) => {
          console.error('Error en el login:', error);
          Swal.fire({
            title: 'Error en el login',
            text: 'Usuario o contraseña incorrectos.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo',
            confirmButtonColor: 'var(--colorBoton)',
          });
        }
      });
    }
  }
}
