import {Component, EventEmitter, Output} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../../../material.module';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import {FooterComponent} from "../../../components/footer/footer.component";
import {environment} from "../../../../environments/environment";


@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, // Importamos para solicitudes HTTP
    NgIf,
    FooterComponent,
    // Asegúrate de incluir NgIf aquí
  ],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {

  // Configuración del formulario con validadores
  form = new FormGroup(
    {
      name: new FormControl('', [Validators.required]), // Campo de Name
      username: new FormControl('', [Validators.required]), // Campo de Username
      correo: new FormControl('', [Validators.required, Validators.email]), // Campo de Email
      password: new FormControl('', [Validators.required, Validators.minLength(8)]), // Contraseña
      repeatedPassword: new FormControl('', [Validators.required, Validators.minLength(8)]), // Confirmar Contraseña
    },
    { validators: this.passwordMatchValidator() } // Validador personalizado
  );

  constructor(private router: Router, private http: HttpClient) {}

  goToLogin() {
    this.router.navigate(['/authentication/login']);
  }

  // Validador personalizado para verificar si las contraseñas coinciden
  passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const repeatedPassword = group.get('repeatedPassword')?.value;

      return password === repeatedPassword ? null : { passwordsMismatch: true };
    };
  }

  get f() {
    return this.form.controls;
  }

  // Método para enviar el formulario
  submit() {
    if (this.form.valid) {
      const user = {
        name: this.form.get('name')?.value,
        username: this.form.get('username')?.value,
        correo: this.form.get('correo')?.value,
        password: this.form.get('password')?.value,
        repeatedPassword: this.form.get('repeatedPassword')?.value,
      };

      console.log('Datos enviados al backend:', user); // Debugging

      this.http.post(environment.baseUrlRegistro, user).subscribe(
        (response) => {
          console.log('Usuario registrado con éxito:', response);
          this.router.navigate(['/authentication/login']);

          // Mostrar alerta
          Swal.fire({
            title: '¡Usuario registrado!',
            text: 'El usuario se ha registrado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: 'var(--colorPrimario)',
          }).then(() => {
            // Actualizar la página después de cerrar la alerta
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error al registrar usuario:', error);

          // Mostrar alerta de error con SweetAlert2
          Swal.fire({
            title: 'Error',
            text: error.error.backedMessage || 'Error al registrar. Por favor, intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: 'var(--colorPrimario)',
          });
        }
      );
    } else {
      // Mostrar alerta para campos inválidos
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor, revisa los campos del formulario.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'var(--colorPrimario)',
      });
    }
  }
}
