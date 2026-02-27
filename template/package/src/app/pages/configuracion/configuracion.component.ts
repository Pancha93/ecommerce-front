import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgIf,
    MatIcon
  ]
})
export class ConfiguracionComponent implements OnInit {
  emailConfigForm!: FormGroup;
  cargando = false;
  configCargada = false;
  hide = true;
  private baseUrl = environment.baseUrlApi;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private httpClient: HttpClient
  ) {}

  toggleHide(): void {
    this.hide = !this.hide;
  }

  ngOnInit(): void {
    // Construir el formulario con validaciones
    this.emailConfigForm = this.fb.group({
      id: [null],
      host: ['', Validators.required],
      port: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      auth: [true],
      starttlsEnable: [true]
    });

    this.cargarConfiguracion();
  }

  cargarConfiguracion(): void {
    this.cargando = true;
    const url = `${this.baseUrl}/email-config`;
    this.httpClient.get<any>(url).subscribe({
      next: (config) => {
        if (config) {
          this.emailConfigForm.patchValue(config);
          this.configCargada = true;
        } else {
          this.snackBar.open('No se encontraron datos de configuración, complete los campos', 'Cerrar', { duration: 3000 });
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener la configuración', err);
        this.cargando = false;
        this.snackBar.open('Error al obtener la configuración, intente nuevamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  guardarConfiguracion(): void {
    if (this.emailConfigForm.invalid) {
      this.snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }
    const config = this.emailConfigForm.value;
    config.id = 1;
    this.cargando = true;
    const url = `${this.baseUrl}/email-config`;
    this.httpClient.put<any>(url, config).subscribe({
      next: () => {
        this.cargando = false;
        this.snackBar.open('Configuración actualizada correctamente', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error al actualizar la configuración', err);
        this.cargando = false;
        this.snackBar.open('Hubo un error al actualizar la configuración', 'Cerrar', { duration: 3000 });
      }
    });
  }

  testConfiguracion(): void {
    if (this.emailConfigForm.invalid) {
      this.snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }
    const config = this.emailConfigForm.value;
    const url = `${this.baseUrl}/email-config/test`;
    this.cargando = true;

    this.httpClient.post<any>(url, config, {
      responseType: 'text' as 'json' // Forzar como texto
    }).subscribe({
      next: (response) => {
        this.cargando = false;
        let mensaje: string;
        try {
          const jsonResponse = JSON.parse(response);
          mensaje = jsonResponse.message || 'La configuración es válida';
        } catch {
          mensaje = response;
        }
        this.snackBar.open(`Éxito: ${mensaje}`, 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error en test de configuración:', err);
        this.cargando = false;
        let mensajeError = 'Error en la configuración. Revise las credenciales o la configuración ingresada';
        if (err.error && typeof err.error === 'string') {
          mensajeError = err.error;
        }
        this.snackBar.open(mensajeError, 'Cerrar', { duration: 3000 });
      }
    });
  }
}
