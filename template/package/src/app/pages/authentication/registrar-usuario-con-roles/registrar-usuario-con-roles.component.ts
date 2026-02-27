import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router, RouterModule } from "@angular/router";
import Swal from "sweetalert2";
import { MaterialModule } from '../../../material.module';
import {CommonModule, JsonPipe, NgIf} from '@angular/common';
import { PermissionService } from "../services/PermissionService";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {FormlyModule} from "@ngx-formly/core";
import {FormlyMaterialModule} from "@ngx-formly/material";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatTabsModule} from "@angular/material/tabs";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {environment} from "../../../../environments/environment";


interface Role {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-registrar-usuario-con-roles',
  standalone: true,
  imports: [
    RouterModule,
    NgIf,
    ReactiveFormsModule,
    MaterialModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    JsonPipe,     CommonModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './registrar-usuario-con-roles.component.html',
  styleUrl: './registrar-usuario-con-roles.component.scss'
})
export class RegistrarUsuarioConRolesComponent implements OnInit {
  form: FormGroup;
  listaRoles: Role[] = [];
  isLoadingRoles = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private permissionService: PermissionService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.cargarRoles();
    console.log('Lista de roles:', this.listaRoles); // Verifica que los datos estén presentes
  }

  private initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatedPassword: ['', [Validators.required, Validators.minLength(8)]],
      roles: [[], [Validators.required]] // Array vacío inicial para roles
    }, {
      validators: this.passwordMatchValidator()
    });
  }

  cargarRoles() {
    this.isLoadingRoles = true;
    this.permissionService.getRoles().subscribe({
      next: (roles) => {
        this.listaRoles = roles;
        console.log('Roles cargados:', roles); // Verifica que los roles se estén cargando correctamente
        this.isLoadingRoles = false;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar los roles',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--colorBoton)'
        });
        this.isLoadingRoles = false;
      }
    });
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const repeatedPassword = control.get('repeatedPassword');

      if (password && repeatedPassword && password.value !== repeatedPassword.value) {
        return { passwordsMismatch: true };
      }
      return null;
    };
  }

  submit() {
    if (this.form.valid) {
      const userData = {
        name: this.form.get('name')?.value,
        username: this.form.get('username')?.value,
        correo: this.form.get('correo')?.value,
        password: this.form.get('password')?.value,
        repeatedPassword: this.form.get('repeatedPassword')?.value,
        roles: this.form.get('roles')?.value
      };

      this.http.post(environment.baseUrlRegistro, userData).subscribe({
        next: (response) => {
          Swal.fire({
            title: '¡Registro exitoso!',
            text: 'El usuario ha sido registrado correctamente con los roles seleccionados.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: 'var(--colorPrimario)',
          }).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al registrar usuario. Por favor, intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: 'var(--colorPrimario)',
          });
        }
      });
    }
  }
}
