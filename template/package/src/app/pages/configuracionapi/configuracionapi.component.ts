// Importaciones core de Angular
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfiguracionApiService } from '../../services/ConfiguracionApiService';

// Importaciones de Angular Material para UI components
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Importaciones específicas para tipos de datos especiales

/**
 * Componente principal para la gestión de la entidad ConfiguracionApi
 * Proporciona una interfaz para visualizar y manipular los datos de la entidad
 */
@Component({
  selector: 'app-configuracionapi',
  standalone: true,
  imports: [
    // Módulos básicos de Angular
    CommonModule,
    RouterModule,
    // Módulos de Angular Material
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
    MatSnackBarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './configuracionapi.component.html',
  styleUrls: ['./configuracionapi.component.scss']
})
export class ConfiguracionApiComponent {
  // Atributos de la entidad con sus tipos correspondientes
  /** id - Campo de tipo number */
  id: number;

  /** nombreApi - Campo de tipo string */
  nombreApi: string;

  /** urlBase - Campo de tipo string */
  urlBase: string;

  /** endpointLogin - Campo de tipo string */
  endpointLogin: string;

  /** campoUsuario - Campo de tipo string */
  campoUsuario: string;

  /** usuario - Campo de tipo string */
  usuario: string;

  /** password - Campo de tipo string */
  password: string;

  /** activo - Campo de tipo boolean */
  activo: boolean;

  /** descripcion - Campo de tipo string */
  descripcion: string;

  /** entidadAsociada - Campo de tipo string */
  entidadAsociada: string;

  /** metodosSoportados - Campo de tipo string */
  metodosSoportados: string;

  /** camposInterfaz - Campo de tipo string */
  camposInterfaz: string;

  /** creador - Campo de tipo string */
  creador: string;

  // Configuración de columnas para tablas de atributos y relaciones
  displayedColumnsAttributes: string[] = ['name', 'type'];
  displayedColumnsRelations: string[] = ['entity', 'type'];

  // DataSource para la tabla de atributos
  dataSourceAttributes = new MatTableDataSource([
    { name: 'id', type: 'Long' },
    { name: 'nombreApi', type: 'String' },
    { name: 'urlBase', type: 'String' },
    { name: 'endpointLogin', type: 'String' },
    { name: 'campoUsuario', type: 'String' },
    { name: 'usuario', type: 'String' },
    { name: 'password', type: 'String' },
    { name: 'activo', type: 'Boolean' },
    { name: 'descripcion', type: 'String' },
    { name: 'entidadAsociada', type: 'String' },
    { name: 'metodosSoportados', type: 'String' },
    { name: 'camposInterfaz', type: 'String' },
    { name: 'creador', type: 'String' },
  ]);

  // DataSource para la tabla de relaciones
  dataSourceRelations = new MatTableDataSource([
  ]);

  /**
   * Constructor del componente
   * @param service Servicio para la gestión de datos de la entidad
   */
  constructor(private service: ConfiguracionApiService) {
    // Inicialización de atributos con valores por defecto
    this.id = 0;
    this.nombreApi = '';
    this.urlBase = '';
    this.endpointLogin = '';
    this.campoUsuario = '';
    this.usuario = '';
    this.password = '';
    this.activo = false;
    this.descripcion = '';
    this.entidadAsociada = '';
    this.metodosSoportados = '';
    this.camposInterfaz = '';
    this.creador = '';
  }
}
