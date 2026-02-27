import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import {MatProgressBar} from '@angular/material/progress-bar';

import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { environment } from '../../../environments/environment';

/**
 * Interfaz que define un atributo de entidad
 */
interface EntityAttribute {
  name: string;
  type: string;
  required: boolean;
}

/**
 * Interfaz para el mapeo de campos
 */
interface FieldMapping {
  fileHeader: string;
  entityAttribute: string;
}

/**
 * Componente para la importación de datos desde archivos Excel y CSV
 * Permite cargar archivos, mapear campos y preparar la importación de datos
 */
@Component({
  selector: 'app-importacion-datos',
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
    MatStepperModule,
    MatExpansionModule,
    MatChipsModule,
    MatProgressBar,
  ],
  templateUrl: './importacion-datos.component.html',
  styleUrls: ['./importacion-datos.component.scss']
})
export class ImportacionDatosComponent implements OnInit {
/** Lista de todas las entidades disponibles */
  availableEntities: string[] = [];

/** Control para el selector de entidades */
  entityControl = new FormControl('');

/** Entidad seleccionada actualmente */
  selectedEntity: string | null = null;

/** Archivo seleccionado */
  selectedFile: File | null = null;

/** Todos los encabezados detectados en el archivo */
  allFileHeaders: string[] = [];

/** Encabezados seleccionados para importar */
  fileHeaders: string[] = [];

/** Datos del archivo (primeros 20 registros) */
  fileData: any[] = [];

/** Columnas para la tabla de vista previa */
  previewColumns: string[] = [];

/** Data source para la tabla de vista previa */
  previewDataSource = new MatTableDataSource<any>([]);

/** Atributos de la entidad seleccionada */
  entityAttributes: EntityAttribute[] = [];

/** Formulario para el mapeo de campos */
  mappingForm!: FormGroup;

/** Lista de mapeos de campos */
  fieldMappings: FieldMapping[] = [];

/** Flags de estado */
  isLoading = false;
  fileProcessed = false;
  headersSelected = false;
  entitySelected = false;
  mappingCompleted = false;

  /** Configuración para procesamiento por lotes */
  readonly BATCH_SIZE = 25;
  readonly BATCH_DELAY = 500; // 0.5 segundos entre lotes
  readonly MAX_CONCURRENT_BATCHES = 5;

  /** Estado del procesamiento por lotes */
  batchProcessing = false;
  currentBatch = 0;
  totalBatches = 0;
  batchProgress = 0;
  batchResults: any = {
    imported: 0,
    errors: [],
    totalProcessed: 0
  };

  /** Referencias a componentes de Angular Material */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /** Mapeo de entidades y sus atributos */
  private entityAttributesMap: Map<string, EntityAttribute[]> = new Map();
  private baseUrl = environment.baseUrlApi;

  /** Datos para validación */
  validationResults: any[] = [];
  validDataToImport: any[] = [];
  invalidDataSummary: any[] = [];
  validationCompleted = false;
  hasValidationErrors = false;

  constructor(
    private snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.initializeEntities();
    this.initializeMappingForm();
  }

  ngOnInit(): void {
    this.entityControl.valueChanges.subscribe(value => {
      if (value) {
        this.selectedEntity = value;
        this.loadEntityAttributes(value);
        this.entitySelected = true;
        this.prepareMappingForm();
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
      { name: 'nombre', type: 'String', required: true },
      { name: 'record', type: 'String', required: true },
      { name: 'rx', type: 'String', required: true },
      { name: 'piezas', type: 'Integer', required: true },
      { name: 'shade', type: 'String', required: true },
      { name: 'lab', type: 'String', required: true },
      { name: 'fechaEnvio', type: 'LocalDate', required: true },
      { name: 'fechaEntrega', type: 'LocalDate', required: true },
      { name: 'factura', type: 'String', required: true },
      { name: 'monto', type: 'Double', required: true },
      { name: 'pay', type: 'String', required: true },
      { name: 'cheque', type: 'String', required: true },
      { name: 'creador', type: 'String', required: false },
    ]);
  }

  /**
   * Maneja la selección de archivos
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.processFile(file);
    }
  }

  /**
   * Procesa el archivo seleccionado
   */
  private processFile(file: File): void {
    this.isLoading = true;
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (fileExtension === 'csv') {
          this.processCSVData(data as string);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          this.processExcelData(data);
        } else {
          this.showMessage('Formato de archivo no soportado. Use Excel (.xlsx, .xls) o CSV (.csv)', 'error');
          this.isLoading = false;
          return;
        }

        this.fileProcessed = true;
        this.uploadFileToServer(file);
      } catch (error) {
        console.error('Error procesando archivo:', error);
        this.showMessage('Error al procesar el archivo', 'error');
        this.isLoading = false;
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }

  /**
   * Procesa datos CSV
   */
  private processCSVData(csvText: string): void {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      this.showMessage('El archivo CSV está vacío', 'error');
      this.isLoading = false;
      return;
    }

    // Extraer todos los encabezados
    this.allFileHeaders = this.parseCSVLine(lines[0]);
    // Inicialmente, mostrar todos los encabezados en la vista previa
    this.previewColumns = [...this.allFileHeaders];

    // Extraer datos (máximo 20 registros)
    this.fileData = [];
    const maxRows = Math.min(lines.length - 1, 20);
    for (let i = 1; i <= maxRows; i++) {
      const rowData = this.parseCSVLine(lines[i]);
      const rowObject: any = {};
      this.allFileHeaders.forEach((header, index) => {
        rowObject[header] = rowData[index] || '';
      });
      this.fileData.push(rowObject);
    }

    this.previewDataSource.data = this.fileData;
    this.isLoading = false;
    this.showMessage(`Archivo CSV procesado. ${this.allFileHeaders.length} columnas, ${this.fileData.length} filas de muestra`, 'success');
  }

  /**
   * Parsea una línea CSV considerando campos entre comillas
   */
  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  /**
   * Procesa datos Excel
   */
  private processExcelData(data: any): void {
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length === 0) {
      this.showMessage('El archivo Excel está vacío', 'error');
      this.isLoading = false;
      return;
    }

    // Extraer encabezados
    this.allFileHeaders = (jsonData[0] as any[]).map(header => String(header || '').trim());
    // Inicialmente, mostrar todos los encabezados en la vista previa
    this.previewColumns = [...this.allFileHeaders];

    // Extraer datos (máximo 20 registros)
    this.fileData = [];
    const maxRows = Math.min(jsonData.length - 1, 20);
    for (let i = 1; i <= maxRows; i++) {
      const rowData = jsonData[i] as any[];
      const rowObject: any = {};
      this.allFileHeaders.forEach((header, index) => {
        rowObject[header] = rowData[index] || '';
      });
      this.fileData.push(rowObject);
    }

    this.previewDataSource.data = this.fileData;
    this.isLoading = false;
    this.showMessage(`Archivo Excel procesado. ${this.allFileHeaders.length} columnas, ${this.fileData.length} filas de muestra`, 'success');
  }

  /**
   * Sube el archivo al servidor
   */
  private uploadFileToServer(file: File): void {
    const formData = new FormData();
    formData.append('file', file);

    // Endpoint para subir archivo a la carpeta raíz
    this.httpClient.post(`${this.baseUrl}/upload-import-file`, formData).subscribe({
      next: (response) => {
        console.log('Archivo subido exitosamente:', response);
      },
      error: (error) => {
        console.error('Error subiendo archivo:', error);
        // No mostrar error al usuario, es opcional
      }
    });
  }

  /**
   * Carga los atributos de la entidad seleccionada
   */
  private loadEntityAttributes(entityName: string): void {
    this.entityAttributes = this.entityAttributesMap.get(entityName) || [];
  }

  /**
   * Inicializa el formulario de mapeo
   */
  private initializeMappingForm(): void {
    this.mappingForm = this.formBuilder.group({});
  }

  /**
   * Confirma la selección de encabezados
   */
  confirmHeaderSelection(): void {
    if (this.fileHeaders.length === 0) {
      this.showMessage('Debe seleccionar al menos un encabezado para continuar', 'error');
      return;
    }

    this.headersSelected = true;
    this.showMessage(`${this.fileHeaders.length} encabezados seleccionados para importar`, 'success');
  }

  /**
   * Alterna la selección de un encabezado
   */
  toggleHeaderSelection(header: string): void {
    const index = this.fileHeaders.indexOf(header);
    if (index === -1) {
      this.fileHeaders.push(header);
    } else {
      this.fileHeaders.splice(index, 1);
    }
  }

  /**
   * Verifica si un encabezado está seleccionado
   */
  isHeaderSelected(header: string): boolean {
    return this.fileHeaders.includes(header);
  }

  /**
   * Selecciona todos los encabezados
   */
  selectAllHeaders(): void {
    this.fileHeaders = [...this.allFileHeaders];
  }

  /**
   * Deselecciona todos los encabezados
   */
  deselectAllHeaders(): void {
    this.fileHeaders = [];
  }

  /**
   * Prepara el formulario de mapeo con los campos necesarios
   */
  private prepareMappingForm(): void {
    if (!this.fileHeaders.length || !this.entityAttributes.length) {
      return;
    }

    // Crear controles para cada encabezado seleccionado del archivo
    const controls: any = {};
    this.fileHeaders.forEach((header, index) => {
      controls[`fileHeader_${index}`] = new FormControl(header);
      controls[`entityAttribute_${index}`] = new FormControl('');
    });

    this.mappingForm = this.formBuilder.group(controls);
    this.fieldMappings = this.fileHeaders.map(header => ({ fileHeader: header, entityAttribute: '' }));
  }

  /**
   * Obtiene las opciones disponibles para un select de encabezados
   */
  getAvailableHeadersForIndex(currentIndex: number): string[] {
    const selectedHeaders = this.fieldMappings
      .map((mapping, index) => index !== currentIndex ? mapping.fileHeader : null)
      .filter(header => header);
    
    return this.fileHeaders.filter(header => !selectedHeaders.includes(header));
  }

  /**
   * Obtiene las opciones disponibles para un select de atributos
   */
  getAvailableAttributesForIndex(currentIndex: number): EntityAttribute[] {
    const selectedAttributes = this.fieldMappings
      .map((mapping, index) => index !== currentIndex ? mapping.entityAttribute : null)
      .filter(attr => attr);
    
    return this.entityAttributes.filter(attr => !selectedAttributes.includes(attr.name));
  }

  /**
   * Actualiza el mapeo cuando cambia la selección de encabezado
   */
  onHeaderSelectionChange(index: number, selectedHeader: string): void {
    this.fieldMappings[index].fileHeader = selectedHeader;
    this.checkMappingCompletion();
  }

  /**
   * Actualiza el mapeo cuando cambia la selección de atributo
   */
  onAttributeSelectionChange(index: number, selectedAttribute: string): void {
    this.fieldMappings[index].entityAttribute = selectedAttribute;
    this.checkMappingCompletion();
  }

  /**
   * Verifica si el mapeo está completo
   */
  private checkMappingCompletion(): void {
    this.mappingCompleted = this.fieldMappings.every(mapping => 
      mapping.fileHeader && mapping.entityAttribute
    );
  }

  /**
   * Valida los datos del archivo según las reglas de validación
   */
  validarDatos(): void {
    if (!this.mappingCompleted) {
      this.showMessage('Complete el mapeo de todos los campos antes de validar', 'error');
      return;
    }

    this.isLoading = true;
    this.validDataToImport = [];
    this.invalidDataSummary = [];
    this.hasValidationErrors = false;

    // Procesar todos los datos del archivo (no solo la vista previa)
    this.processAllFileData().then(allData => {
      this.validateAllData(allData);
    }).catch(error => {
      console.error('Error procesando archivo completo:', error);
      this.showMessage('Error al procesar el archivo completo', 'error');
      this.isLoading = false;
    });
  }

  /**
   * Procesa todos los datos del archivo
   */
  private processAllFileData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        reject('No hay archivo seleccionado');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const fileExtension = this.selectedFile!.name.split('.').pop()?.toLowerCase();
          let allData: any[] = [];

          if (fileExtension === 'csv') {
            allData = this.processCompleteCSVData(data as string);
          } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            allData = this.processCompleteExcelData(data);
          }

          resolve(allData);
        } catch (error) {
          reject(error);
        }
      };

      if (this.selectedFile.name.endsWith('.csv')) {
        reader.readAsText(this.selectedFile);
      } else {
        reader.readAsArrayBuffer(this.selectedFile);
      }
    });
  }

  /**
   * Procesa datos CSV completos
   */
  private processCompleteCSVData(csvText: string): any[] {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = this.parseCSVLine(lines[0]);
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const rowData = this.parseCSVLine(lines[i]);
      const rowObject: any = { _rowNumber: i + 1 };
      headers.forEach((header, index) => {
        rowObject[header] = rowData[index] || '';
      });
      data.push(rowObject);
    }
    return data;
  }

  /**
   * Procesa datos Excel completos
   */
  private processCompleteExcelData(data: any): any[] {
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = (jsonData[0] as any[]).map(header => String(header || '').trim());
    const allData: any[] = [];

    for (let i = 1; i < jsonData.length; i++) {
      const rowData = jsonData[i] as any[];
      const rowObject: any = { _rowNumber: i + 1 };
      headers.forEach((header, index) => {
        rowObject[header] = rowData[index] || '';
      });
      allData.push(rowObject);
    }
    return allData;
  }

  /**
   * Valida todos los datos según las reglas de validación
   */
  private validateAllData(allData: any[]): void {
    const validationRules = this.getValidationRules();
    let totalErrors = 0;

    allData.forEach(row => {
      const rowValidation: any = { _rowNumber: row._rowNumber, isValid: true, errors: [] };

      this.fieldMappings.forEach(mapping => {
        const fileValue = row[mapping.fileHeader];
        const entityAttr = this.entityAttributes.find(attr => attr.name === mapping.entityAttribute);
        
        if (entityAttr) {
          const validationResult = this.validateFieldValue(fileValue, entityAttr.type, entityAttr.name, mapping.fileHeader);
          if (!validationResult.isValid) {
            rowValidation.isValid = false;
            rowValidation.errors.push({
              fileHeader: mapping.fileHeader,
              entityField: mapping.entityAttribute,
              value: fileValue,
              error: validationResult.error
            });
            totalErrors++;
          }
        }
      });

      if (rowValidation.isValid) {
        this.validDataToImport.push(row);
      } else {
        this.invalidDataSummary.push(rowValidation);
        this.hasValidationErrors = true;
      }
    });

    this.validationCompleted = true;
    this.isLoading = false;

    if (totalErrors === 0) {
      this.showMessage(`Validación exitosa: ${this.validDataToImport.length} registros listos para importar`, 'success');
    } else {
      this.showMessage(`Validación completada: ${this.validDataToImport.length} registros válidos, ${this.invalidDataSummary.length} con errores`, 'error');
    }
  }

  /**
   * Valida un valor específico según el tipo de dato
   */
  private validateFieldValue(value: any, dataType: string, fieldName: string, fileHeader: string): { isValid: boolean, error?: string } {
    const strValue = String(value || '').trim();

    // Si el valor está vacío, verificar si el campo es requerido
    if (!strValue) {
      const entityAttr = this.entityAttributes.find(attr => attr.name === fieldName);
      if (entityAttr?.required) {
        return { isValid: false, error: 'Campo requerido no puede estar vacío' };
      }
      return { isValid: true };
    }

    switch (dataType.toLowerCase()) {
      case 'string':
        return this.validateString(strValue, fieldName);
      case 'integer':
      case 'int':
      case 'long':
        return this.validateInteger(strValue);
      case 'double':
      case 'float':
        return this.validateDecimal(strValue);
      case 'boolean':
        return this.validateBoolean(strValue);
      case 'date':
      case 'localdate':
      case 'localdatetime':
        return this.validateDate(strValue);
      case 'localtime':
        return this.validateTime(strValue);
      default:
        return { isValid: true };
    }
  }

  /**
   * Métodos de validación específicos por tipo
   */
  private validateString(value: string, fieldName: string): { isValid: boolean, error?: string } {
    if (fieldName.toLowerCase().includes('email') || fieldName.toLowerCase().includes('correo')) {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(value)) {
        return { isValid: false, error: 'Formato de email inválido' };
      }
    }
    return { isValid: true };
  }

  private validateInteger(value: string): { isValid: boolean, error?: string } {
    const num = parseInt(value);
    if (isNaN(num)) {
      return { isValid: false, error: 'Debe ser un número entero válido' };
    }
    if (num < -2147483648 || num > 2147483647) {
      return { isValid: false, error: 'Número fuera del rango permitido' };
    }
    return { isValid: true };
  }

  private validateDecimal(value: string): { isValid: boolean, error?: string } {
    const num = parseFloat(value);
    if (isNaN(num)) {
      return { isValid: false, error: 'Debe ser un número decimal válido' };
    }
    return { isValid: true };
  }

  private validateBoolean(value: string): { isValid: boolean, error?: string } {
    const lowerValue = value.toLowerCase();
    const validValues = ['true', 'false', '1', '0', 'sí', 'si', 'no', 'verdadero', 'falso'];
    if (!validValues.includes(lowerValue)) {
      return { isValid: false, error: 'Debe ser true/false, 1/0, sí/no, verdadero/falso' };
    }
    return { isValid: true };
  }

  private validateDate(value: string): { isValid: boolean, error?: string } {
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/,
      /^\d{2}\/\d{2}\/\d{4}$/,
      /^\d{2}-\d{2}-\d{4}$/,
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
    ];
    
    const hasValidPattern = datePatterns.some(pattern => pattern.test(value));
    if (!hasValidPattern) {
      return { isValid: false, error: 'Formato de fecha inválido (use YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY)' };
    }
    
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { isValid: false, error: 'Fecha inválida' };
    }
    return { isValid: true };
  }

  private validateTime(value: string): { isValid: boolean, error?: string } {
    const timePattern = /^\d{2}:\d{2}(:\d{2})?$/;
    if (!timePattern.test(value)) {
      return { isValid: false, error: 'Formato de hora inválido (use HH:MM o HH:MM:SS)' };
    }
    return { isValid: true };
  }

  private getValidationRules(): any {
    // Implementar reglas de validación si es necesario
    return {};
  }

  /**
   * Descarga el resumen de errores de validación
   */
  descargarResumenErrores(): void {
    if (this.invalidDataSummary.length === 0) {
      this.showMessage('No hay errores para descargar', 'error');
      return;
    }

    const csvContent = this.generateErrorSummaryCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `errores_validacion_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    this.showMessage('Resumen de errores descargado', 'success');
  }

  /**
   * Genera el CSV con el resumen de errores
   */
  private generateErrorSummaryCSV(): string {
    let csvContent = 'Fila,Campo del Archivo,Campo de la Entidad,Valor,Error\n';

    this.invalidDataSummary.forEach(row => {
      row.errors.forEach((error: any) => {
        csvContent += `${row._rowNumber},${error.fileHeader},${error.entityField},"${error.value}","${error.error}"\n`;
      });
    });

    return csvContent;
  }

  /**
   * Método para importar datos válidos al sistema usando procesamiento por lotes
   */
  importarDatos(): void {
    if (!this.mappingCompleted) {
      this.showMessage('Complete el mapeo de todos los campos antes de importar', 'error');
      return;
    }

    if (this.validDataToImport.length === 0) {
      this.showMessage('No hay datos válidos para importar', 'error');
      return;
    }

    // Siempre usar procesamiento por lotes
    this.importByBatches();
  }

  /**
   * Importación por lotes para grandes volúmenes de datos
   */
  private async importByBatches(): Promise<void> {
    this.isLoading = true;
    this.batchProcessing = true;
    
    const transformedData = this.transformDataForImport();
    const batches = this.createBatches(transformedData, this.BATCH_SIZE);
    
    this.totalBatches = batches.length;
    this.currentBatch = 0;
    this.batchResults = { imported: 0, errors: [], totalProcessed: 0 };
    
    this.showMessage(`Iniciando importación por lotes: ${this.totalBatches} lotes de ${this.BATCH_SIZE} registros`, 'success');
    
    try {
      const service = await this.getEntityService();
      if (!service) {
        throw new Error('No se pudo cargar el servicio para la entidad');
      }
      
      await this.processBatchSequentially(service, batches, 0);
      
    } catch (error) {
      console.error('Error en importación por lotes:', error);
      this.showMessage('Error durante la importación por lotes', 'error');
    } finally {
      this.isLoading = false;
      this.batchProcessing = false;
      this.showFinalBatchResults();
    }
  }

  /**
   * Crear lotes de registros
   */
  private createBatches<T>(array: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Procesar lotes secuencialmente
   */
  private async processBatchSequentially(service: any, batches: any[][], batchIndex: number): Promise<void> {
    if (batchIndex >= batches.length) {
      return;
    }
    
    const batch = batches[batchIndex];
    this.currentBatch = batchIndex + 1;
    this.batchProgress = (this.currentBatch / this.totalBatches) * 100;
    
    console.log(`Procesando lote ${this.currentBatch}/${this.totalBatches}`);
    
    try {
      const batchResult = await this.processSingleBatch(service, batch, batchIndex * this.BATCH_SIZE);
      
      this.batchResults.imported += batchResult.imported;
      this.batchResults.errors.push(...batchResult.errors);
      this.batchResults.totalProcessed += batch.length;
      
      // Delay entre lotes
      if (batchIndex < batches.length - 1) {
        await this.delay(this.BATCH_DELAY);
      }
      
      // Procesar siguiente lote
      await this.processBatchSequentially(service, batches, batchIndex + 1);
      
    } catch (error) {
      console.error(`Error en lote ${batchIndex + 1}:`, error);
      
      // Agregar todos los registros del lote como errores
      batch.forEach((record: any, index: number) => {
        this.batchResults.errors.push({
          rowNumber: batchIndex * this.BATCH_SIZE + index + 1,
          data: record,
          error: 'Error en lote: ' + error
        });
      });
      
      this.batchResults.totalProcessed += batch.length;
      
      // Continuar con el siguiente lote
      await this.processBatchSequentially(service, batches, batchIndex + 1);
    }
  }

  /**
   * Procesar un lote específico
   */
  private async processSingleBatch(service: any, batch: any[], startIndex: number): Promise<{imported: number, errors: any[]}> {
    const promises = batch.map((record, index) => 
      this.processRecord(service, record, startIndex + index + 1)
    );
    
    const results = await Promise.allSettled(promises);
    
    const imported = results.filter(r => r.status === 'fulfilled').length;
    const errors = results
      .map((r, index) => ({ result: r, index }))
      .filter(({ result }) => result.status === 'rejected')
      .map(({ result, index }) => ({
        rowNumber: startIndex + index + 1,
        data: batch[index],
        error: (result as PromiseRejectedResult).reason || 'Error desconocido'
      }));
    
    return { imported, errors };
  }

  /**
   * Procesar un registro individual como Promise
   */
  private processRecord(service: any, record: any, rowNumber: number): Promise<any> {
    return new Promise((resolve, reject) => {
      service.save(record).subscribe({
        next: (response: any) => resolve(response),
        error: (error: any) => reject(error.message || 'Error desconocido')
      });
    });
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Mostrar resultados finales del procesamiento por lotes
   */
  private showFinalBatchResults(): void {
    const { imported, errors, totalProcessed } = this.batchResults;
    
    if (errors.length === 0) {
      this.showMessage(
        `🎉 Importación por lotes exitosa: ${imported} registros importados correctamente`,
        'success'
      );
      setTimeout(() => this.resetForm(), 3000);
    } else if (imported > 0) {
      this.showMessage(
        `⚠️ Importación por lotes parcial: ${imported} registros importados, ${errors.length} con errores`,
        'error'
      );
      this.generateImportErrorReport(errors);
    } else {
      this.showMessage(
        `❌ Error en importación por lotes: ${errors.length} registros fallaron`,
        'error'
      );
      this.generateImportErrorReport(errors);
    }
    
    console.log('Resumen de importación por lotes:', this.batchResults);
  }

  /**
   * Obtiene el servicio de la entidad seleccionada dinámicamente
   */
  private async getEntityService(): Promise<any> {
    if (!this.selectedEntity) {
      return null;
    }
    try {
      // Importar el servicio dinámicamente
      const module = await import(`../../services/${this.selectedEntity}Service`);
      const serviceClass = module[`${this.selectedEntity}Service`];
      
      if (serviceClass) {
        return new serviceClass(this.httpClient);
      }
      
      return null;
    } catch (error) {
      console.error(`Error importing service for ${this.selectedEntity}:`, error);
      return null;
    }
  }

  /**
   * Genera un reporte de errores de importación
   */
  private generateImportErrorReport(errors: any[]): void {
    if (errors.length === 0) return;
    
    let csvContent = 'Fila,Error,Datos\n';
    
    errors.forEach(error => {
      const dataStr = JSON.stringify(error.data).replace(/"/g, '""');
      csvContent += `${error.rowNumber},"${error.error}","${dataStr}"\n`;
    });
    
    // Descargar el reporte automáticamente
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `errores_importacion_${this.selectedEntity}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showMessage('Reporte de errores descargado automáticamente', 'success');
    }
  }

  /**
   * Transforma los datos válidos según el mapeo configurado
   */
  private transformDataForImport(): any[] {
    return this.validDataToImport.map(row => {
      const transformedRow: any = {};
      
      this.fieldMappings.forEach(mapping => {
        const fileValue = row[mapping.fileHeader];
        const entityAttr = this.entityAttributes.find(attr => attr.name === mapping.entityAttribute);
        
        if (entityAttr && fileValue !== undefined && fileValue !== null) {
          // Transformar el valor según el tipo de dato de la entidad
          transformedRow[mapping.entityAttribute] = this.transformFieldValue(
            fileValue, 
            entityAttr.type
          );
        }
      });
      
      return transformedRow;
    });
  }

  /**
   * Transforma un valor específico según el tipo de dato
   */
  private transformFieldValue(value: any, dataType: string): any {
    const strValue = String(value || '').trim();
    
    if (!strValue) {
      return null;
    }
    
    switch (dataType.toLowerCase()) {
      case 'string':
        return strValue;
      
      case 'integer':
      case 'int':
      case 'long':
        return parseInt(strValue);
      
      case 'double':
      case 'float':
        return parseFloat(strValue);
      
      case 'boolean':
        const lowerValue = strValue.toLowerCase();
        return ['true', '1', 'sí', 'si', 'verdadero'].includes(lowerValue);
      
      case 'date':
      case 'localdate':
        // Convertir diferentes formatos de fecha a ISO
        if (strValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          const [day, month, year] = strValue.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else if (strValue.match(/^\d{2}-\d{2}-\d{4}$/)) {
          const [day, month, year] = strValue.split('-');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return strValue; // Ya está en formato ISO o será procesado por el backend
      
      case 'localdatetime':
        return strValue;
      
      case 'localtime':
        // Asegurar formato HH:MM:SS
        if (strValue.match(/^\d{2}:\d{2}$/)) {
          return strValue + ':00';
        }
        return strValue;
      
      default:
        return strValue;
    }
  }

  /**
   * Muestra un mensaje al usuario
   */
  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }

  /**
   * Reinicia el formulario y estado
   */
  resetForm(): void {
    this.selectedFile = null;
    this.allFileHeaders = [];
    this.fileHeaders = [];
    this.fileData = [];
    this.previewColumns = [];
    this.previewDataSource.data = [];
    this.selectedEntity = null;
    this.entityControl.setValue('');
    this.entityAttributes = [];
    this.fieldMappings = [];
    this.fileProcessed = false;
    this.headersSelected = false;
    this.entitySelected = false;
    this.mappingCompleted = false;
    this.initializeMappingForm();
    this.validationResults = [];
    this.validDataToImport = [];
    this.invalidDataSummary = [];
    this.validationCompleted = false;
    this.hasValidationErrors = false;
    this.showMessage('Formulario reiniciado', 'success');
  }
}
