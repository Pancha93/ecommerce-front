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
  selector: 'app-gestion-roles',
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
  templateUrl: './gestion-roles.component.html',
  styleUrl: './gestion-roles.component.scss'
})
export class GestionRolesComponent  implements OnInit {

  //formulario para asignar un rol a un rol
  formRolHijo = new FormGroup({});
  modeloRolHijo: any = {
    rol: '',
    rolesHijos: ''
  };
  fieldsFormRolHijo: FormlyFieldConfig[] = [];

  // Columnas que se mostrarán en la tabla
  displayedColumnsRoles: string[] = ['rolPadre', 'rolesHijos', 'acciones'];
  //displayedColumnsUsuarios: string[] = ['id', 'username', 'correo', 'roles', 'acciones'];


  dataSourceRoles = new MatTableDataSource<any>([]);

  @ViewChild('paginatorRoles') paginatorRoles!: MatPaginator;
  @ViewChild('sortRoles') sortRoles!: MatSort;
  @ViewChild('createRolModal') createRolModal!: TemplateRef<any>;
  @ViewChild('assignRolModal') assignRolModal!: TemplateRef<any>;


  //formulario para crear un rol
  formRol: FormGroup;

  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl

  )  { //
    // Inicializa el formulario de rol
    this.formRol = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.pattern('^[A-Z_]+$')  // Solo letras mayúsculas y guiones bajos
      ]],
      esAdministrador: [false, Validators.required] // Campo nuevo
    });

    this.customizePaginator();
  }

  ngAfterViewInit() {
    this.dataSourceRoles.paginator = this.paginatorRoles;
    this.dataSourceRoles.sort = this.sortRoles;
  }


  ngOnInit() {

    // Configurar la lógica de filtrado personalizada para roles
    this.dataSourceRoles.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();

      // Buscar en el nombre del rol padre (que está en la propiedad nombre)
      const rolPadreMatch = data.nombre.toLowerCase().includes(searchText);

      // Buscar en los roles hijos
      const rolesHijosMatch = data.rolesHijos?.some((rolHijo: any) =>
        rolHijo.nombre.toLowerCase().includes(searchText)
      ) || false;

      return rolPadreMatch || rolesHijosMatch;
    };

    this.iniciarFormularioRolHijo();
    this.cargarRoles();
    this.customizePaginator();
  }

  iniciarFormularioRolHijo() {
    this.fieldsFormRolHijo = [
      {
        key: 'rol',
        type: 'select',
        templateOptions: {
          label: 'Seleccione el rol padre',
          required: true,
          options: [],
          valueProp: 'nombre',
          labelProp: 'nombre'
        }
      },
      {
        key: 'rolesHijos',
        type: 'select',
        templateOptions: {
          label: 'Seleccione el rol hijo',
          multiple: true,
          required: true,
          options: [],
          valueProp: 'nombre',
          labelProp: 'nombre'
        }
      }
    ];

    this.cargarOpcionesRoles();
  }

  cargarOpcionesRoles() {
    this.permissionService.getRoles().subscribe({
      next: (roles) => {
        if (this.fieldsFormRolHijo[0]?.props) {
          this.fieldsFormRolHijo[0].props.options = roles;
        }

        if (this.fieldsFormRolHijo[1]?.props) {
          this.fieldsFormRolHijo[1].props.options = roles;
        }
      },
      error: (error) => {
        if (error.status !== 404) {  // Ignoramos 404 ya que es esperado cuando no hay roles
          console.error('Error al cargar roles:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar roles',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'var(--colorBoton)'
          });
        }
      }
    });
  }

  cargarRoles() {
    this.permissionService.getRoles().subscribe({
      next: (roles) => {
        this.dataSourceRoles.data = roles;
        this.dataSourceRoles.paginator = this.paginatorRoles;
        this.dataSourceRoles.sort = this.sortRoles;
      },
      error: (error) => {
        if (error.status !== 404) {
          console.error('Error al cargar jerarquía de roles:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar jerarquía de roles',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'var(--colorBoton)'
          });
        }
      }
    });
  }

  onSubmitRol() {
    if (this.formRol.valid) {
      const newRol = this.formRol.value;

      this.permissionService.crearRol(newRol).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Rol creado exitosamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'var(--colorBoton)',
            timer: 3000,
            timerProgressBar: true
          });
          this.resetFormRol();
          //this.iniciarRoles();
          this.actualizarTablaRoles();
          this.iniciarFormularioRolHijo()
        },
        error: (error) => {
          console.error('Error al crear rol:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Error al crear el rol',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'var(--colorBoton)',
          });
        }
      });
    }
  }

  resetFormRol() {
    this.formRol.reset();
  }

  onSubmitRolHijo() {
    if (this.formRolHijo.valid) {
      const modelData: any = { ...this.modeloRolHijo };

      if (modelData.rolesHijos.includes(modelData.rol)) {
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'No puede seleccionar el mismo rol',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--colorBoton)',
        });
        return;
      }

      this.permissionService.agregarRol(modelData).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Rol hijo asignado exitosamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'var(--colorBoton)',
            timer: 3000,
            timerProgressBar: true
          });
          this.cargarRoles();
          this.formRolHijo.reset();
        },
        error => {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error: ' + (error.error?.message || 'Error al asignar rol hijo'),
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'var(--colorBoton)'
          });
        });
    }
  }

  quitarRolHijo(rolPadreId: number, rolHijoId: number, nombreRolPadre: string, nombreRolHijo: string): void {
    const mensaje = `¿Está seguro que desea quitar el rol "${nombreRolHijo}" del rol "${nombreRolPadre}"?`;

    Swal.fire({
      title: 'Confirmar acción',
      text: mensaje,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--colorBoton)',
      cancelButtonColor: 'var(--colorError)',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.permissionService.quitarRolHijo(rolPadreId, rolHijoId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Rol hijo desasociado exitosamente',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'var(--colorBoton)',
              timer: 3000,
              timerProgressBar: true
            });
            this.cargarRoles(); // Recarga la jerarquía de roles
          },
          error: (error) => {
            console.error('Error al desasociar el rol hijo:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al desasociar el rol hijo',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'var(--colorBoton)',
            });
          }
        });
      }
    });
  }

  eliminarRolPadre(rolPadreId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el rol permanentemente y no se podrá deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--colorBoton)',
      cancelButtonColor: 'var(--colorError)',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llama al servicio para eliminar el rol padre
        this.permissionService.eliminarRolPadre(rolPadreId).subscribe(
          () => {
            Swal.fire({
              title: 'Rol eliminado',
              text: 'El rol se ha eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: 'var(--colorBoton)',
            });
            // Actualiza la tabla de roles después de eliminar
            this.actualizarTablaRoles();
            this.iniciarFormularioRolHijo()
          },
          (error) => {
            console.error('Error al eliminar el rol padre:', error);
            let mensajeError = 'No se pudo eliminar el rol. Inténtalo de nuevo más tarde.';
            if (error.status === 409) {
              mensajeError = 'No se puede eliminar el rol porque está asociado a otras entidades.';
            }
            Swal.fire({
              title: 'Error',
              text: mensajeError,
              icon: 'error',
              confirmButtonText: 'Cerrar',
              confirmButtonColor: 'var(--colorBoton)',
            });
          }
        );
      }
    });
  }

  actualizarTablaRoles(): void {
    this.permissionService.getRoles().subscribe((roles) => {
      this.dataSourceRoles = roles;
    });
  }

// Métodos de filtro
  applyFilterRoles(filterValue: string) {
    this.dataSourceRoles.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceRoles.paginator) {
      this.dataSourceRoles.paginator.firstPage();
    }
  }

  exportRolesToExcel(): void {
    try {
      const displayedColumns = this.displayedColumnsRoles.filter(column => column !== 'acciones');
      const exportData = this.dataSourceRoles.filteredData.map(row => {
        const formattedRow: any = {};
        displayedColumns.forEach(column => {
          if (column === 'rolesHijos') {
            // Formatear los roles hijos como una cadena
            formattedRow[column] = row.rolesHijos?.map((rol: any) => rol.nombre).join(', ') || '';
          } else if (column === 'rolPadre') {
            formattedRow[column] = row.nombre;
          } else {
            formattedRow[column] = row[column];
          }
        });
        return formattedRow;
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Roles');
      XLSX.writeFile(wb, 'roles_exportados.xlsx');

      this.showMessage('Roles exportados exitosamente', 'success');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      this.showMessage('Error al exportar los roles', 'error');
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

  private getCombinedValuesForFilterRoles(data: any): string {
    let combinedValues = '';

    this.displayedColumnsRoles.forEach(column => {
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

  openCreateRolModal() {
    const dialogRef = this.dialog.open(this.createRolModal, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // Manejar el cierre del modal si es necesario
    });
  }

  openAssignRolModal() {
    const dialogRef = this.dialog.open(this.assignRolModal, {
      width: '500px',
      disableClose: true
    });

    this.cargarOpcionesRoles();

    dialogRef.afterClosed().subscribe(result => {
      // Manejar el cierre del modal si es necesario
    });
  }

}

