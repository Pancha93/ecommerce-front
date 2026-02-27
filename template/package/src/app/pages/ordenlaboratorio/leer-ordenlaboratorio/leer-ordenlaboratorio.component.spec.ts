// Importaciones de módulos de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
// Importaciones del componente y servicio a probar
import { LeerOrdenlaboratorioComponent } from './leer-ordenlaboratorio.component';
import { OrdenlaboratorioService } from '../../../services/OrdenlaboratorioService';

/**
 * Suite de pruebas para el componente LeerOrdenlaboratorio
 */
describe('LeerOrdenlaboratorioComponent', () => {
  // Variables para el componente y su fixture
  let component: LeerOrdenlaboratorioComponent;
  let fixture: ComponentFixture<LeerOrdenlaboratorioComponent>;

  /**
   * Configuración asíncrona del entorno de pruebas
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeerOrdenlaboratorioComponent ],
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
    fixture = TestBed.createComponent(LeerOrdenlaboratorioComponent);
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
