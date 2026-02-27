import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchivoEjemploComponent } from './archivo-ejemplo.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Mock para XLSX
jest.mock('xlsx', () => ({
  utils: {
    book_new: jest.fn(() => ({ SheetNames: [], Sheets: {} })),
    aoa_to_sheet: jest.fn(() => ({ '!ref': 'A1:C2' })),
    book_append_sheet: jest.fn(),
    decode_range: jest.fn(() => ({ s: { c: 0, r: 0 }, e: { c: 2, r: 1 } })),
    encode_cell: jest.fn((cell) => `${String.fromCharCode(65 + cell.c)}${cell.r + 1}`)
  },
  writeFile: jest.fn()
}));

describe('ArchivoEjemploComponent', () => {
  let component: ArchivoEjemploComponent;
  let fixture: ComponentFixture<ArchivoEjemploComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ArchivoEjemploComponent,
        MatSnackBarModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivoEjemploComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have availableEntities populated', () => {
    expect(component.availableEntities.length).toBeGreaterThan(0);
  });

  it('should prevent generating files when no attributes selected', () => {
    const showMessageSpy = jest.spyOn(component as any, 'showMessage');
    
    component.generateExcelExample();
    expect(showMessageSpy).toHaveBeenCalledWith('No hay atributos seleccionados para el Excel', 'error');
    
    component.generateCSVExample();
    expect(showMessageSpy).toHaveBeenCalledWith('No hay atributos seleccionados para el CSV', 'error');
  });

  it('should escape CSV fields correctly', () => {
    expect((component as any).escapeCSVField('simple')).toBe('simple');
    expect((component as any).escapeCSVField('field,with,commas')).toBe('"field,with,commas"');
    expect((component as any).escapeCSVField('field"with"quotes')).toBe('"field""with""quotes"');
    expect((component as any).escapeCSVField('field\nwith\nnewlines')).toBe('"field\nwith\nnewlines"');
  });
});
