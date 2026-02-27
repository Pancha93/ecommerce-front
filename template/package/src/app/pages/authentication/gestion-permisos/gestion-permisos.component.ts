import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
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
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
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
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-permisos',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './gestion-permisos.component.html',
  styleUrl: './gestion-permisos.component.scss'
})
export class GestionPermisosComponent implements OnInit, AfterViewInit {
  // Formulario para seleccionar rol y usuario
  formUsuario = new FormGroup({});
  modelUsuario: any = {
    rol: '',
    usuario: ''
  };
  fieldsUsuario: FormlyFieldConfig[] = [];

  // Listas para los selects
  listaRoles: any[] = [];
  usuarios: any[] = [];

  // Configuración de la tabla
  displayedColumnsPermisos: string[] = ['accion', 'objeto', 'tipoObjeto', 'autorizado', 'acciones'];
  dataSourcePermisos = new MatTableDataSource<any>([]);
  isBuscarDisabled: boolean = true;

  // Referencias para paginación y ordenamiento
  @ViewChild('paginatorPermisos') paginatorPermisos!: MatPaginator;
  @ViewChild('sortPermisos') sortPermisos!: MatSort;

  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl
  ) {}

  ngOnInit() {
    this.iniciarFormularios();
    this.iniciarRoles();
    this.iniciarUsuarios();
    this.customizePaginator();

    // Configurar el filtro personalizado
    this.dataSourcePermisos.filterPredicate = (data, filter) => {
      const searchText = filter.trim().toLowerCase();
      const combinedValues = this.getCombinedValuesForFilterPermisos(data);
      return combinedValues.includes(searchText);
    };
  }

  ngAfterViewInit() {
    // Conectar el paginador y el ordenador a la tabla
    this.dataSourcePermisos.paginator = this.paginatorPermisos;
    this.dataSourcePermisos.sort = this.sortPermisos;
  }

  iniciarTabla(rolId: number, usuarioId: number) {
    this.permissionService.getPermisosByRolAndUser(rolId, usuarioId).subscribe({
      next: (permisos) => {
        const accionMap: { [key: string]: string } = {
          save: 'Crear',
          update: 'Modificar',
          deleteById: 'Eliminar',
          findAll: 'Listar'
        };

        // Mapear los permisos y asignarlos al dataSource
        const permisosFormateados = permisos.map((permiso: any) => ({
          ...permiso,
          accion: accionMap[permiso.accion] || permiso.accion
        }));

        this.dataSourcePermisos.data = permisosFormateados;

        // Actualizar el paginador y ordenador
        this.dataSourcePermisos.paginator = this.paginatorPermisos;
        this.dataSourcePermisos.sort = this.sortPermisos;

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Permisos cargados exitosamente',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--colorBoton)',
          timer: 3000,
          timerProgressBar: true
        });
      },
      error: (error) => {
        console.error('Error al cargar permisos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar los permisos',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--colorBoton)',
        });
      }
    });
  }

  iniciarUsuarios() {
    this.permissionService.getUsers().subscribe({
      next: (response) => {
        this.usuarios = response;
        if (this.fieldsUsuario[1]?.props) {
          this.fieldsUsuario[1].props.options = response;
        }
      },
      error: (error) => {
        console.error('Error al cargar Usuarios:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar Usuarios',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--colorBoton)',
        });
      }
    });
  }

  iniciarRoles() {
    this.permissionService.getRoles().subscribe({
      next: (response) => {
        this.listaRoles = response;
        if (this.fieldsUsuario[0]?.props) {
          this.fieldsUsuario[0].props.options = response;
        }
      },
      error: (error) => {
        console.error('Error al cargar Roles:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar Roles',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--colorBoton)',
        });
      }
    });
  }

  iniciarFormularios() {
    this.fieldsUsuario = [
      {
        key: 'rol',
        type: 'select',
        props: {
          label: 'Seleccione un rol',
          required: false,
          options: [],
          valueProp: 'id',
          labelProp: 'nombre',
          change: () => this.updateButtonState()
        }
      },
      {
        key: 'usuario',
        type: 'select',
        props: {
          label: 'Seleccione el usuario',
          required: false,
          options: [],
          valueProp: 'id',
          labelProp: 'name',
          change: () => this.updateButtonState()
        }
      }
    ];
  }

  updateButtonState() {
    this.isBuscarDisabled = !(this.modelUsuario.rol || this.modelUsuario.usuario);
  }

  onSubmitPermisos() {
    const rolId = this.modelUsuario.rol;
    const usuarioId = this.modelUsuario.usuario;
    this.iniciarTabla(rolId, usuarioId);
  }

  actualizarPrivilegio(dto: any) {
    dto.autorizado = !dto.autorizado;
    this.permissionService.actualizarPrivilegio(dto).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Permiso actualizado',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--colorBoton)',
          timer: 3000,
          timerProgressBar: true
        });
        this.onSubmitPermisos();
      },
      error: (error) => {
        console.log("Error al cambiar el estado del permiso");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el permiso',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--colorBoton)',
        });
      }
    });
  }

  // Métodos para filtrado
  applyFilterPermisos(filterValue: string) {
    this.dataSourcePermisos.filter = filterValue.trim().toLowerCase();
    if (this.dataSourcePermisos.paginator) {
      this.dataSourcePermisos.paginator.firstPage();
    }
  }

  // Método para exportar a Excel
  exportPermisosToExcel(): void {
    try {
      const displayedColumns = this.displayedColumnsPermisos.filter(column => column !== 'acciones');
      const exportData = this.dataSourcePermisos.filteredData.map(row => {
        const formattedRow: any = {};
        displayedColumns.forEach(column => {
          if (column === 'autorizado') {
            formattedRow[column] = row[column] ? 'Sí' : 'No';
          } else {
            formattedRow[column] = row[column];
          }
        });
        return formattedRow;
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Permisos');
      XLSX.writeFile(wb, 'permisos_exportados.xlsx');

      this.showMessage('Permisos exportados exitosamente', 'success');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      this.showMessage('Error al exportar los permisos', 'error');
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

  private getCombinedValuesForFilterPermisos(data: any): string {
    let combinedValues = '';

    this.displayedColumnsPermisos.forEach(column => {
      if (column === 'acciones') {
        return;
      }
      if (column === 'autorizado') {
        combinedValues += (data[column] ? 'Sí' : 'No') + ' ';
      } else {
        combinedValues += (data[column] || '') + ' ';
      }
    });

    return combinedValues.toLowerCase();
  }
}
