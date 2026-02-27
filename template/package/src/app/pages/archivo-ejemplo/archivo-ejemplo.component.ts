import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';

// Importaciones de Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChip, MatChipListbox, MatChipSet } from '@angular/material/chips';

/**
 * Interfaz que define un atributo de entidad
 */
interface EntityAttribute {
  name: string;
  type: string;
  selected: boolean;
  isTextArea?: boolean;
  entity?: string;
}

/**
 * Componente para la generación de archivos de ejemplo (Excel y CSV)
 * Permite seleccionar entidades y sus atributos para generar archivos con encabezados y datos de ejemplo
 */
@Component({
  selector: 'app-archivo-ejemplo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipListbox,
    MatChip,
    MatChipSet
  ],
  templateUrl: './archivo-ejemplo.component.html',
  styleUrls: ['./archivo-ejemplo.component.scss']
})
export class ArchivoEjemploComponent implements OnInit {
  /** Lista de todas las entidades disponibles */
  availableEntities: string[] = [];

  /** Control para el selector de entidades */
  entityControl = new FormControl('');

  /** Entidad seleccionada actualmente */
  selectedEntity: string | null = null;

  /** Columnas a mostrar en la tabla de atributos */
  displayedColumns: string[] = ['name', 'type', 'actions'];

  /** Data source para la tabla de atributos */
  attributesDataSource = new MatTableDataSource<EntityAttribute>([]);

  /** Atributos seleccionados para el archivo */
  selectedAttributes: EntityAttribute[] = [];

  /** Flag para indicar si se está generando un archivo */
  isGeneratingFile = false;

  /** Referencias a componentes de Angular Material */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /** Mapeo de entidades y sus atributos */
  private entityAttributesMap: Map<string, EntityAttribute[]> = new Map();

  constructor(private snackBar: MatSnackBar) {
    this.initializeEntities();
  }

  ngOnInit(): void {
    this.entityControl.valueChanges.subscribe(value => {
      if (value) {
        this.resetSelectedAttributes();
        this.selectedEntity = value;
        this.loadEntityAttributes(value);
      }
    });
  }

  private initializeEntities(): void {
    this.availableEntities = [
      'Ordenlaboratorio',
    ];
    this.initializeEntityAttributes();
  }

  private initializeEntityAttributes(): void {
    this.entityAttributesMap.set('Ordenlaboratorio', [
      { name: 'id', type: 'long', selected: false },
      { name: 'nombre', type: 'String', selected: false },
      { name: 'record', type: 'String', selected: false },
      { name: 'rx', type: 'String', selected: false },
      { name: 'piezas', type: 'Integer', selected: false },
      { name: 'shade', type: 'String', selected: false },
      { name: 'lab', type: 'String', selected: false },
      { name: 'fechaEnvio', type: 'LocalDate', selected: false },
      { name: 'fechaEntrega', type: 'LocalDate', selected: false },
      { name: 'factura', type: 'String', selected: false },
      { name: 'monto', type: 'Double', selected: false },
      { name: 'pay', type: 'String', selected: false },
      { name: 'cheque', type: 'String', selected: false },
      { name: 'creador', type: 'String', selected: false },
    ]);
  }

  loadEntityAttributes(entityName: string): void {
    const attributes = this.entityAttributesMap.get(entityName) || [];
    attributes.forEach(attr => {
      const isSelected = this.selectedAttributes.some(
        selected => selected.name === attr.name && (selected as any).entity === entityName
      );
      attr.selected = isSelected;
    });
    this.attributesDataSource.data = attributes;
    setTimeout(() => {
      if (this.paginator && this.sort) {
        this.attributesDataSource.paginator = this.paginator;
        this.attributesDataSource.sort = this.sort;
      }
    });
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }

  private resetSelectedAttributes(): void {
    this.selectedAttributes = [];
    if (this.selectedEntity) {
      const attributes = this.entityAttributesMap.get(this.selectedEntity) || [];
      attributes.forEach(attr => attr.selected = false);
      this.attributesDataSource.data = [...attributes];
    }
    this.showMessage('Se han reiniciado los atributos seleccionados', 'success');
  }

  toggleAttributeSelection(attribute: EntityAttribute): void {
    if (!this.selectedEntity) return;
    const attributeWithEntity = { ...attribute, entity: this.selectedEntity };
    attribute.selected = !attribute.selected;
    if (attribute.selected) {
      this.selectedAttributes.push(attributeWithEntity as any);
      this.showMessage(`Atributo ${attribute.name} añadido`, 'success');
    } else {
      const index = this.selectedAttributes.findIndex(
        attr => attr.name === attribute.name && (attr as any).entity === this.selectedEntity
      );
      if (index >= 0) {
        this.selectedAttributes.splice(index, 1);
        this.showMessage(`Atributo ${attribute.name} eliminado`, 'success');
      }
    }
  }

  /**
   * Genera el archivo Excel de ejemplo con los encabezados seleccionados
   */
  generateExcelExample(): void {
    if (this.selectedAttributes.length === 0) {
      this.showMessage('No hay atributos seleccionados para el Excel', 'error');
      return;
    }

    this.isGeneratingFile = true;

    try {
      const attributesByEntity = this.selectedAttributes.reduce((acc, attr) => {
        const entity = (attr as any).entity || '';
        if (!acc[entity]) acc[entity] = [];
        acc[entity].push(attr);
        return acc;
      }, {} as Record<string, EntityAttribute[]>);

      const workbook = XLSX.utils.book_new();

      Object.entries(attributesByEntity).forEach(([entityName, attributes]) => {
        const headers = attributes.map(attr => attr.name);
        const exampleRow = attributes.map(attr => this.getExampleValue(attr.type));
        const worksheetData = [headers, exampleRow];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        
        // Aplicar estilos a los encabezados
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
          if (!worksheet[cellAddress]) continue;
          worksheet[cellAddress].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '4472C4' } },
            alignment: { horizontal: 'center' }
          };
        }
        
        const columnWidths = headers.map(header => ({ width: Math.max(header.length + 5, 15) }));
        worksheet['!cols'] = columnWidths;
        XLSX.utils.book_append_sheet(workbook, worksheet, entityName);
      });

      const entities = Object.keys(attributesByEntity);
      const fileName = entities.length === 1 
        ? `Ejemplo_${entities[0]}_${new Date().toISOString().split('T')[0]}.xlsx`
        : `Ejemplo_Multiple_Entidades_${new Date().toISOString().split('T')[0]}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      this.showMessage('Archivo Excel generado con éxito', 'success');
      this.resetSelectedAttributes();
      
    } catch (error) {
      console.error('Error al generar Excel:', error);
      this.showMessage('Error al generar el archivo Excel', 'error');
    } finally {
      this.isGeneratingFile = false;
    }
  }

  /**
   * Genera el archivo CSV de ejemplo con los encabezados seleccionados
   */
  generateCSVExample(): void {
    if (this.selectedAttributes.length === 0) {
      this.showMessage('No hay atributos seleccionados para el CSV', 'error');
      return;
    }

    this.isGeneratingFile = true;

    try {
      const attributesByEntity = this.selectedAttributes.reduce((acc, attr) => {
        const entity = (attr as any).entity || '';
        if (!acc[entity]) acc[entity] = [];
        acc[entity].push(attr);
        return acc;
      }, {} as Record<string, EntityAttribute[]>);

      Object.entries(attributesByEntity).forEach(([entityName, attributes]) => {
        const headers = attributes.map(attr => attr.name);
        const exampleRow = attributes.map(attr => this.getExampleValue(attr.type));
        
        // Construir contenido CSV
        let csvContent = '';
        
        // Agregar encabezados
        csvContent += headers.map(header => this.escapeCSVField(header)).join(',') + '\n';
        
        // Agregar fila de ejemplo
        csvContent += exampleRow.map(value => this.escapeCSVField(value)).join(',') + '\n';
        
        // Crear y descargar archivo
        const fileName = `Ejemplo_${entityName}_${new Date().toISOString().split('T')[0]}.csv`;
        this.downloadCSV(csvContent, fileName);
      });

      this.showMessage('Archivo(s) CSV generado(s) con éxito', 'success');
      this.resetSelectedAttributes();
      
    } catch (error) {
      console.error('Error al generar CSV:', error);
      this.showMessage('Error al generar el archivo CSV', 'error');
    } finally {
      this.isGeneratingFile = false;
    }
  }

  /**
   * Escapa un campo para formato CSV
   */
  private escapeCSVField(field: string): string {
    if (field == null) return '';
    
    const fieldStr = String(field);
    
    // Si el campo contiene comas, comillas dobles o saltos de línea, debe ir entre comillas
    if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n') || fieldStr.includes('\r')) {
      // Escapar comillas dobles duplicándolas
      return '"' + fieldStr.replace(/"/g, '""') + '"';
    }
    
    return fieldStr;
  }

  /**
   * Descarga un archivo CSV
   */
  private downloadCSV(content: string, fileName: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private getExampleValue(type: string): string {
    switch (type.toLowerCase()) {
      case 'string': return 'Texto de ejemplo';
      case 'integer':
      case 'int':
      case 'long': return '123';
      case 'double':
      case 'float': return '123.45';
      case 'boolean': return 'true';
      case 'date':
      case 'localdate': return '2024-01-15';
      case 'localdatetime': return '2024-01-15 10:30:00';
      case 'localtime': return '10:30:00';
      default: return 'Valor ejemplo';
    }
  }
}
