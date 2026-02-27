// Importaciones core de Angular
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrdenlaboratorioService } from '../../services/OrdenlaboratorioService';

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
import { DatePipe } from '@angular/common';

/**
 * Componente principal para la gestión de la entidad Ordenlaboratorio
 * Proporciona una interfaz para visualizar y manipular los datos de la entidad
 */
@Component({
  selector: 'app-ordenlaboratorio',
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
  templateUrl: './ordenlaboratorio.component.html',
  styleUrls: ['./ordenlaboratorio.component.scss']
})
export class OrdenlaboratorioComponent {
  // Atributos de la entidad con sus tipos correspondientes
  /** id - Campo de tipo number */
  id: number;

  /** nombre - Campo de tipo string */
  nombre: string;

  /** record - Campo de tipo string */
  record: string;

  /** rx - Campo de tipo string */
  rx: string;

  /** piezas - Campo de tipo number */
  piezas: number;

  /** shade - Campo de tipo string */
  shade: string;

  /** lab - Campo de tipo string */
  lab: string;

  /** fechaEnvio - Campo de tipo Date */
  fechaEnvio: Date;

  /** fechaEntrega - Campo de tipo Date */
  fechaEntrega: Date;

  /** factura - Campo de tipo string */
  factura: string;

  /** monto - Campo de tipo number */
  monto: number;

  /** pay - Campo de tipo string */
  pay: string;

  /** cheque - Campo de tipo string */
  cheque: string;

  /** creador - Campo de tipo string */
  creador: string;

  // Configuración de columnas para tablas de atributos y relaciones
  displayedColumnsAttributes: string[] = ['name', 'type'];
  displayedColumnsRelations: string[] = ['entity', 'type'];

  // DataSource para la tabla de atributos
  dataSourceAttributes = new MatTableDataSource([
    { name: 'id', type: 'long' },
    { name: 'nombre', type: 'String' },
    { name: 'record', type: 'String' },
    { name: 'rx', type: 'String' },
    { name: 'piezas', type: 'Integer' },
    { name: 'shade', type: 'String' },
    { name: 'lab', type: 'String' },
    { name: 'fechaEnvio', type: 'LocalDate' },
    { name: 'fechaEntrega', type: 'LocalDate' },
    { name: 'factura', type: 'String' },
    { name: 'monto', type: 'Double' },
    { name: 'pay', type: 'String' },
    { name: 'cheque', type: 'String' },
    { name: 'creador', type: 'String' },
  ]);

  // DataSource para la tabla de relaciones
  dataSourceRelations = new MatTableDataSource([
  ]);

  /**
   * Constructor del componente
   * @param service Servicio para la gestión de datos de la entidad
   */
  constructor(private service: OrdenlaboratorioService) {
    // Inicialización de atributos con valores por defecto
    this.id = 0;
    this.nombre = '';
    this.record = '';
    this.rx = '';
    this.piezas = 0;
    this.shade = '';
    this.lab = '';
    this.fechaEnvio = new Date();
    this.fechaEntrega = new Date();
    this.factura = '';
    this.monto = 0;
    this.pay = '';
    this.cheque = '';
    this.creador = '';
  }
}
