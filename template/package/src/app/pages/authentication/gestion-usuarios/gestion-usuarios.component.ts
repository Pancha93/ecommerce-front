import {Component, model, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { DateTime } from 'luxon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PermissionService } from '../services/PermissionService';
import {Observable} from "rxjs";
import { AppSideRegisterComponent } from "../side-register/side-register.component";
import {RegistrarUsuarioConRolesComponent} from "../registrar-usuario-con-roles/registrar-usuario-con-roles.component";
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [
    CommonModule,
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
    AppSideRegisterComponent,
    RegistrarUsuarioConRolesComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.scss'
})
export class GestionUsuariosComponent implements OnInit {

  //formulario para asignar un rol a un usuario
  form= new FormGroup({});
  modelo: any = {
    roles: '',
    username:''
  };
  fieldsForm: FormlyFieldConfig[] = [];

  // Columnas que se mostrarán en la tabla
  displayedColumnsUsuarios: string[] = ['id', 'username', 'correo', 'roles', 'acciones'];


  dataSourceUsuarios = new MatTableDataSource<any>([]);

  @ViewChild('createUserModal') createUserModal!: TemplateRef<any>;
  @ViewChild('assignRolesModal') assignRolesModal!: TemplateRef<any>;
  @ViewChild('paginatorUsuarios') paginatorUsuarios!: MatPaginator;
  @ViewChild('sortUsuarios') sortUsuarios!: MatSort;

  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl

  )  { }

  ngAfterViewInit() {
    this.dataSourceUsuarios.paginator = this.paginatorUsuarios;
    this.dataSourceUsuarios.sort = this.sortUsuarios;
  }


  ngOnInit() {

    this.dataSourceUsuarios.filterPredicate = (data, filter) => {
      const searchText = filter.trim().toLowerCase();
      const combinedValues = this.getCombinedValuesForFilterUsuarios(data);
      return combinedValues.includes(searchText);
    };

    this.iniciarTabla();
    this.iniciarFormularios();
    this.iniciarRoles();
    this.customizePaginator();
  }

  iniciarTabla(){
    this.permissionService.getUsers().subscribe(
      response => {
        console.log('Datos recibidos:', response);
        this.dataSourceUsuarios.data = response;
        this.dataSourceUsuarios.paginator = this.paginatorUsuarios;
        this.dataSourceUsuarios.sort = this.sortUsuarios;
      },
      error => {
        console.error('Error al cargar la tabla:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar la tabla',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--colorBoton)'
        });
      }
    );
  }

  iniciarRoles(){
    this.permissionService.getRoles().subscribe(
      response => {

        if (this.fieldsForm[0]?.props) {
          this.fieldsForm[0].props.options = response;
        }

      },
      error => {
        console.error('Error al cargar Roles:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar Roles',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--colorBoton)'
        });
      }
    );
  }

  iniciarFormularios(){
    this.fieldsForm = [
      {
        key: 'roles',
        type: 'select',
        templateOptions: {
          label: 'Seleccione un rol',
          multiple: true,
          options: [],
          valueProp: 'nombre',
          labelProp: 'nombre',
        },
      },
      {
        key: 'username',
        type: 'input',
        templateOptions: {
          label: 'Usuario',
          placeholder: 'Ingrese usuario',
          required: true,
          minLength: 1,
          maxLength: 255,
          pattern: '^[a-zA-Z0-9\\s\\-_\\.]*$',
          patternError: 'Caracteres no válidos'
        }
      }
    ];
  }

  onSubmit(){
    if (this.form.valid) {
      const modelData = { ...this.modelo };

      this.permissionService.asignarRol(modelData).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Rol asignado exitosamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'var(--colorBoton)',
            timer: 3000,
            timerProgressBar: true
          });
          this.iniciarTabla();
        },
        error => {
          console.log("hp", error);
          console.error('Error:', error.error.backedMessage);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error: ' + error.error.backedMessage,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'var(--colorBoton)',
          });
        }
      );

    }
  }

  quitarRol(usuarioId: number, rolId: number) {
    Swal.fire({
      title: 'Confirmar acción',
      text: '¿Estás seguro de que deseas quitar este rol?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--colorBoton)',
      cancelButtonColor: 'var(--colorError)',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.permissionService.quitarRol(usuarioId, rolId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Rol eliminado exitosamente',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'var(--colorBoton)',
              timer: 3000,
              timerProgressBar: true
            });
            this.iniciarTabla(); // Recargar la tabla de usuarios
          },
          error: (error) => {
            console.error('Error al quitar el rol:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al quitar el rol',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'var(--colorBoton)',
            });
          }
        });
      }
    });
  }

  eliminarUsuario(usuarioId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará al usuario permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: 'var(--colorBoton)',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'var(--colorError)',
    }).then((result) => {
      if (result.isConfirmed) {
        // Llama al servicio para eliminar al usuario
        this.permissionService.eliminarUsuario(usuarioId).subscribe(
          () => {
            Swal.fire({
              title: 'Usuario eliminado',
              text: 'El usuario se ha eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: 'var(--colorBoton)',
            });
            // Actualiza la tabla de usuarios después de eliminar
            this.actualizarTabla();
          },
          (error) => {
            console.error('Error al eliminar usuario:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar al usuario. Inténtalo de nuevo más tarde.',
              icon: 'error',
              confirmButtonText: 'Cerrar',
              confirmButtonColor: 'var(--colorBoton)',
            });
          }
        );
      }
    });
  }

  actualizarTabla(): void {
    this.permissionService.getUsers().subscribe((usuarios) => {
      this.dataSourceUsuarios = usuarios;
    });
  }

// Métodos de filtro
  applyFilterUsuarios(filterValue: string) {
    this.dataSourceUsuarios.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceUsuarios.paginator) {
      this.dataSourceUsuarios.paginator.firstPage();
    }
  }

  exportUsuariosToExcel(): void {
    try {
      const displayedColumns = this.displayedColumnsUsuarios.filter(column => column !== 'acciones');
      const exportData = this.dataSourceUsuarios.filteredData.map(row => {
        const formattedRow: any = {};
        displayedColumns.forEach(column => {
          if (column === 'roles') {
            // Formatear los roles como una cadena
            formattedRow[column] = row[column]?.map((rol: any) => rol.nombre).join(', ') || '';
          } else {
            formattedRow[column] = row[column];
          }
        });
        return formattedRow;
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
      XLSX.writeFile(wb, 'usuarios_exportados.xlsx');

      this.showMessage('Usuarios exportados exitosamente', 'success');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      this.showMessage('Error al exportar los usuarios', 'error');
    }
  }



  private showMessage(message: string, type: 'success' | 'error') {
    Swal.fire({
      icon: type,
      title: type === 'success' ? 'Éxito' : 'Error',
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: type === 'success' ? 'var(--colorBoton)' : 'var(--colorError)',
      timer: type === 'success' ? 3000 : undefined,
      timerProgressBar: type === 'success'
    });
  }

  private customizePaginator(): void {
    this.paginatorIntl.itemsPerPageLabel = 'Ítems por página';
    this.paginatorIntl.nextPageLabel = 'Siguiente';
    this.paginatorIntl.previousPageLabel = 'Anterior';
    this.paginatorIntl.firstPageLabel = 'Primera página';
    this.paginatorIntl.lastPageLabel = 'Última página';
  }

  private getCombinedValuesForFilterUsuarios(data: any): string {
    let combinedValues = '';

    this.displayedColumnsUsuarios.forEach(column => {
      if (column === 'acciones') {
        return;
      }
      if (Array.isArray(data[column])) {
        combinedValues += this.getCollectionSummary(data[column]) + ' ';
      } else if (typeof data[column] === 'object' && data[column] !== null) {
        combinedValues += this.generateSummary(data[column]) + ' ';
      } else {
        combinedValues += (data[column] || '') + ' ';
      }
    });

    return combinedValues.toLowerCase();
  }

  getCollectionSummary(collection: any[] | null, defaultText: string = 'Sin datos'): string {
    if (!collection || collection.length === 0) {
      return defaultText;
    }
    return collection.map(item => this.generateSummary(item)).join('; ');
  }

  generateSummary(value: any, defaultText: string = 'Sin datos'): string {
    if (!value || typeof value !== 'object') {
      return defaultText;
    }

    const keys = Object.keys(value);
    if (keys.length === 0) {
      return defaultText;
    }

    return keys.slice(0, 2).map(key => `${key}: ${value[key]}`).join(', ');
  }

  openCreateUserModal() {
    const dialogRef = this.dialog.open(this.createUserModal, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openAssignRolesModal() {
    const dialogRef = this.dialog.open(this.assignRolesModal, {
      width: '500px',
      disableClose: true
    });

    this.iniciarRoles();

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}

