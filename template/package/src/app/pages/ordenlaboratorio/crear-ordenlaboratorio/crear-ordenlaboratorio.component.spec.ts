// Importaciones de módulos de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
// Importaciones del componente y servicio a probar
import { CrearOrdenlaboratorioComponent } from './crear-ordenlaboratorio.component';
import { OrdenlaboratorioService } from '../../../services/OrdenlaboratorioService';

/**
 * Suite de pruebas para el componente CrearOrdenlaboratorio
 */
describe('CrearOrdenlaboratorioComponent', () => {
  // Variables para el componente y su fixture
  let component: CrearOrdenlaboratorioComponent;
  let fixture: ComponentFixture<CrearOrdenlaboratorioComponent>;

  /**
   * Configuración asíncrona del entorno de pruebas
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearOrdenlaboratorioComponent ],
      imports: [ 
        ReactiveFormsModule,      // Para manejo de formularios reactivos
        FormlyModule.forRoot()    // Para formularios dinámicos
      ],
      providers: [ OrdenlaboratorioService ]  // Servicio necesario
    })
    .compileComponents();
  });

  /**
   * Creación y configuración del componente antes de cada test
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(CrearOrdenlaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test básico para verificar la creación del componente
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
