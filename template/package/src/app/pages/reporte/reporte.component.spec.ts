import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteComponent } from './reporte.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';

// Mock para jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => {
    return {
      internal: {
        pageSize: {
          getWidth: () => 595,
          getHeight: () => 842
        }
      },
      rect: jest.fn(),
      text: jest.fn(),
      line: jest.fn(),
      addPage: jest.fn(),
      save: jest.fn(),
      setDrawColor: jest.fn(),
      setFillColor: jest.fn(),
      setTextColor: jest.fn(),
      setLineWidth: jest.fn(),
      setFontSize: jest.fn(),
      setFont: jest.fn()
    };
  });
});

// Mock para jspdf-autotable
jest.mock('jspdf-autotable', () => jest.fn());

describe('ReporteComponent', () => {
  let component: ReporteComponent;
  let fixture: ComponentFixture<ReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReporteComponent,
        MatSnackBarModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        DatePipe
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have availableEntities populated', () => {
    expect(component.availableEntities.length).toBeGreaterThan(0);
  });

  it('should initialize empty selectedAttributes', () => {
    expect(component.selectedAttributes.length).toBe(0);
  });

  it('should toggle attribute selection when called', () => {
    // Simulate entity selection
    component.selectedEntity = 'TestEntity';
    
    // Create a test attribute
    const testAttribute = { name: 'testAttr', type: 'String', selected: false };
    
    // Call toggle method
    component.toggleAttributeSelection(testAttribute);
    
    // Verify attribute was selected
    expect(testAttribute.selected).toBe(true);
    expect(component.selectedAttributes.length).toBe(1);
    expect((component.selectedAttributes[0] as any).entity).toBe('TestEntity');
    
    // Toggle again to deselect
    component.toggleAttributeSelection(testAttribute);
    
    // Verify attribute was deselected
    expect(testAttribute.selected).toBe(false);
    expect(component.selectedAttributes.length).toBe(0);
  });

  it('should prevent generating report when no attributes selected', () => {
    // Spy on the showMessage method
    const showMessageSpy = jest.spyOn(component as any, 'showMessage');
    
    // Try to generate report with no attributes
    component.generateReport();
    
    // Verify error message was shown
    expect(showMessageSpy).toHaveBeenCalledWith('No hay atributos seleccionados para el reporte', 'error');
  });

  describe('formatValueForReport', () => {
    it('should format Date values correctly', () => {
      const datePipe = TestBed.inject(DatePipe);
      const testDate = new Date('2023-01-15');
      const expected = datePipe.transform(testDate, 'dd/MM/yyyy HH:mm');
      
      const result = (component as any).formatValueForReport(testDate, 'Date');
      expect(result).toBe(expected);
    });
    
    it('should format numeric values with 2 decimal places', () => {
      const result = (component as any).formatValueForReport(123.456, 'Double');
      expect(result).toBe('123.46');
    });
    
    it('should format boolean values as Sí/No', () => {
      expect((component as any).formatValueForReport(true, 'Boolean')).toBe('Sí');
      expect((component as any).formatValueForReport(false, 'Boolean')).toBe('No');
    });
    
    it('should handle null or undefined values', () => {
      expect((component as any).formatValueForReport(null, 'String')).toBe('N/A');
      expect((component as any).formatValueForReport(undefined, 'String')).toBe('N/A');
    });
    
    it('should handle object values', () => {
      const objWithName = { id: 1, nombre: 'Test Name' };
      expect((component as any).formatValueForReport(objWithName, 'Object')).toBe('Test Name');
      
      const objWithId = { id: 2 };
      expect((component as any).formatValueForReport(objWithId, 'Object')).toBe('ID: 2');
    });
  });
});
