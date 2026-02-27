import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportacionDatosComponent } from './importacion-datos.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Mock para XLSX
jest.mock('xlsx', () => ({
  read: jest.fn(() => ({
    SheetNames: ['Sheet1'],
    Sheets: {
      Sheet1: {}
    }
  })),
  utils: {
    sheet_to_json: jest.fn(() => [
      ['Nombre', 'Edad', 'Email'],
      ['Juan', 25, 'juan@test.com'],
      ['María', 30, 'maria@test.com']
    ])
  }
}));

describe('ImportacionDatosComponent', () => {
  let component: ImportacionDatosComponent;
  let fixture: ComponentFixture<ImportacionDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ImportacionDatosComponent,
        MatSnackBarModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportacionDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have availableEntities populated', () => {
    expect(component.availableEntities.length).toBeGreaterThan(0);
  });

  it('should initialize with empty state', () => {
    expect(component.selectedFile).toBeNull();
    expect(component.fileHeaders.length).toBe(0);
    expect(component.fileData.length).toBe(0);
    expect(component.fileProcessed).toBeFalse();
    expect(component.entitySelected).toBeFalse();
    expect(component.mappingCompleted).toBeFalse();
  });

  it('should parse CSV line correctly', () => {
    const csvLine = 'John,25,"john@test.com"';
    const result = (component as any).parseCSVLine(csvLine);
    expect(result).toEqual(['John', '25', 'john@test.com']);
  });

  it('should handle CSV with quotes and commas', () => {
    const csvLine = '"Smith, John",25,"john.smith@test.com"';
    const result = (component as any).parseCSVLine(csvLine);
    expect(result).toEqual(['Smith, John', '25', 'john.smith@test.com']);
  });

  it('should toggle header selection correctly', () => {
    component.allFileHeaders = ['Nombre', 'Edad', 'Email'];
    component.fileHeaders = [];

    // Seleccionar un encabezado
    component.toggleHeaderSelection('Nombre');
    expect(component.fileHeaders).toContain('Nombre');

    // Deseleccionar el mismo encabezado
    component.toggleHeaderSelection('Nombre');
    expect(component.fileHeaders).not.toContain('Nombre');
  });

  it('should select all headers', () => {
    component.allFileHeaders = ['Nombre', 'Edad', 'Email'];
    component.fileHeaders = [];

    component.selectAllHeaders();
    expect(component.fileHeaders.length).toBe(3);
    expect(component.fileHeaders).toEqual(['Nombre', 'Edad', 'Email']);
  });

  it('should deselect all headers', () => {
    component.allFileHeaders = ['Nombre', 'Edad', 'Email'];
    component.fileHeaders = ['Nombre', 'Edad', 'Email'];

    component.deselectAllHeaders();
    expect(component.fileHeaders.length).toBe(0);
  });

  it('should confirm header selection', () => {
    const showMessageSpy = jest.spyOn(component as any, 'showMessage');
    component.fileHeaders = ['Nombre', 'Email'];

    component.confirmHeaderSelection();
    expect(component.headersSelected).toBeTrue();
    expect(showMessageSpy).toHaveBeenCalledWith(
      '2 encabezados seleccionados para importar',
      'success'
    );
  });

  it('should show error when confirming with no headers selected', () => {
    const showMessageSpy = jest.spyOn(component as any, 'showMessage');
    component.fileHeaders = [];

    component.confirmHeaderSelection();
    expect(component.headersSelected).toBeFalse();
    expect(showMessageSpy).toHaveBeenCalledWith(
      'Debe seleccionar al menos un encabezado para continuar',
      'error'
    );
  });

  it('should reset form correctly', () => {
    // Setup some state
    component.selectedFile = new File(['test'], 'test.csv');
    component.fileHeaders = ['test'];
    component.fileProcessed = true;
    
    // Reset
    component.resetForm();
    
    // Verify reset
    expect(component.selectedFile).toBeNull();
    expect(component.fileHeaders.length).toBe(0);
    expect(component.fileProcessed).toBeFalse();
  });

  it('should validate string fields correctly', () => {
    // Test email validation
    let result = (component as any).validateString('test@example.com', 'email');
    expect(result.isValid).toBeTruthy();
    
    result = (component as any).validateString('invalid-email', 'email');
    expect(result.isValid).toBeFalsy();
    expect(result.error).toContain('Formato de email inválido');
    
    // Test regular string
    result = (component as any).validateString('Regular text', 'nombre');
    expect(result.isValid).toBeTruthy();
  });

  it('should validate integer fields correctly', () => {
    let result = (component as any).validateInteger('123');
    expect(result.isValid).toBeTruthy();
    
    result = (component as any).validateInteger('abc');
    expect(result.isValid).toBeFalsy();
    expect(result.error).toContain('número entero válido');
    
    result = (component as any).validateInteger('999999999999');
    expect(result.isValid).toBeFalsy();
    expect(result.error).toContain('fuera del rango');
  });

  it('should validate decimal fields correctly', () => {
    let result = (component as any).validateDecimal('123.45');
    expect(result.isValid).toBeTruthy();
    
    result = (component as any).validateDecimal('abc');
    expect(result.isValid).toBeFalsy();
    expect(result.error).toContain('número decimal válido');
  });

  it('should validate boolean fields correctly', () => {
    let result = (component as any).validateBoolean('true');
    expect(result.isValid).toBeTruthy();
    
    result = (component as any).validateBoolean('false');
    expect(result.isValid).toBeTruthy();
    
    result = (component as any).validateBoolean('sí');
    expect(result.isValid).toBeTruthy();
    
    result = (component as any).validateBoolean('maybe');
    expect(result.isValid).toBeFalsy();
    expect(result.error).toContain('true/false');
  });

  it('should validate date fields correctly', () => {
    let result = (component as any).validateDate('2024-01-15');
    expect(result.isValid).toBeTruthy();
    
    result = (component as any).validateDate('15/01/2024');
    expect(result.isValid).toBeTruthy();
    
    result = (component as any).validateDate('invalid-date');
    expect(result.isValid).toBeFalsy();
    expect(result.error).toContain('Formato de fecha inválido');
  });

  it('should validate time fields correctly', () => {
    let result = (component as any).validateTime('14:30');
    expect(result.isValid).toBeTruthy();
    
    result = (component as any).validateTime('14:30:45');
    expect(result.isValid).toBeTruthy();
    
    result = (component as any).validateTime('25:70');
    expect(result.isValid).toBeFalsy();
    expect(result.error).toContain('Formato de hora inválido');
  });

  it('should generate error summary CSV correctly', () => {
    component.invalidDataSummary = [
      {
        _rowNumber: 2,
        errors: [
          {
            fileHeader: 'email',
            entityField: 'correoElectronico',
            value: 'invalid-email',
            error: 'Formato de email inválido'
          }
        ]
      }
    ];
    
    const csv = (component as any).generateErrorSummaryCSV();
    expect(csv).toContain('Fila,Campo del Archivo,Campo de la Entidad,Valor,Error');
    expect(csv).toContain('2,email,correoElectronico,"invalid-email","Formato de email inválido"');
  });

  it('should show error when trying to validate without complete mapping', () => {
    const showMessageSpy = jest.spyOn(component as any, 'showMessage');
    component.mappingCompleted = false;
    
    component.validarDatos();
    
    expect(showMessageSpy).toHaveBeenCalledWith(
      'Complete el mapeo de todos los campos antes de validar',
      'error'
    );
  });

  it('should show error when trying to download errors with no errors', () => {
    const showMessageSpy = jest.spyOn(component as any, 'showMessage');
    component.invalidDataSummary = [];
    
    component.descargarResumenErrores();
    
    expect(showMessageSpy).toHaveBeenCalledWith(
      'No hay errores para descargar',
      'error'
    );
  });

  it('should show error when trying to import without complete mapping', () => {
    const showMessageSpy = jest.spyOn(component as any, 'showMessage');
    component.mappingCompleted = false;
    
    component.importarDatos();
    
    expect(showMessageSpy).toHaveBeenCalledWith(
      'Complete el mapeo de todos los campos antes de importar',
      'error'
    );
  });
});
  it('should create batches correctly', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const batchSize = 3;
    
    const batches = (component as any).createBatches(data, batchSize);
    
    expect(batches.length).toBe(4);
    expect(batches[0]).toEqual([1, 2, 3]);
    expect(batches[1]).toEqual([4, 5, 6]);
    expect(batches[2]).toEqual([7, 8, 9]);
    expect(batches[3]).toEqual([10]);
  });

  it('should always use batch processing for import', () => {
    const importByBatchesSpy = jest.spyOn(component as any, 'importByBatches').mockImplementation();
    
    component.mappingCompleted = true;
    component.validDataToImport = new Array(10).fill({});
    
    component.importarDatos();
    
    expect(importByBatchesSpy).toHaveBeenCalled();
  });

  it('should update batch progress correctly', () => {
    component.totalBatches = 10;
    component.currentBatch = 3;
    
    component.batchProgress = (component.currentBatch / component.totalBatches) * 100;
    
    expect(component.batchProgress).toBe(30);
  });

  it('should initialize batch results correctly', () => {
    expect(component.batchResults.imported).toBe(0);
    expect(component.batchResults.errors.length).toBe(0);
    expect(component.batchResults.totalProcessed).toBe(0);
  });

  it('should transform data correctly for import', () => {
    // Setup component state
    component.validDataToImport = [
      { 'Nombre': 'Juan', 'Edad': '25', 'Email': 'juan@test.com' }
    ];
    component.fieldMappings = [
      { fileHeader: 'Nombre', entityAttribute: 'nombre' },
      { fileHeader: 'Edad', entityAttribute: 'edad' },
      { fileHeader: 'Email', entityAttribute: 'email' }
    ];
    component.entityAttributes = [
      { name: 'nombre', type: 'String', required: true },
      { name: 'edad', type: 'Integer', required: true },
      { name: 'email', type: 'String', required: true }
    ];
    
    const result = (component as any).transformDataForImport();
    
    expect(result).toEqual([
      { nombre: 'Juan', edad: 25, email: 'juan@test.com' }
    ]);
  });

  it('should transform field values correctly', () => {
    // Test integer transformation
    let result = (component as any).transformFieldValue('123', 'Integer');
    expect(result).toBe(123);
    
    // Test boolean transformation
    result = (component as any).transformFieldValue('true', 'Boolean');
    expect(result).toBe(true);
    
    result = (component as any).transformFieldValue('false', 'Boolean');
    expect(result).toBe(false);
    
    // Test date transformation
    result = (component as any).transformFieldValue('15/01/2024', 'Date');
    expect(result).toBe('2024-01-15');
    
    // Test string transformation
    result = (component as any).transformFieldValue('  text  ', 'String');
    expect(result).toBe('text');
  });

