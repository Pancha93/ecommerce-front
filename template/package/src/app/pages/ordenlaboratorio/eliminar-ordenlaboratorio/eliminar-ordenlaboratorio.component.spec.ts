// Importaciones de módulos de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
// Importaciones del componente y servicio a probar
import { EliminarOrdenlaboratorioComponent } from './eliminar-ordenlaboratorio.component';
import { OrdenlaboratorioService } from '../../../services/OrdenlaboratorioService';

/**
 * Suite de pruebas para el componente EliminarOrdenlaboratorio
 */
describe('EliminarOrdenlaboratorioComponent', () => {
  // Variables para el componente y su fixture
  let component: EliminarOrdenlaboratorioComponent;
  let fixture: ComponentFixture<EliminarOrdenlaboratorioComponent>;

  /**
   * Configuración asíncrona del entorno de pruebas
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EliminarOrdenlaboratorioComponent ],
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
    fixture = TestBed.createComponent(EliminarOrdenlaboratorioComponent);
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
