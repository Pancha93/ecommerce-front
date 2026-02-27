// Importaciones de módulos de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
// Importaciones del componente y servicio a probar
import { LeerConfiguracionapiComponent } from './leer-configuracionapi.component';
import { ConfiguracionApiService } from '../../../services/ConfiguracionApiService';

/**
 * Suite de pruebas para el componente LeerConfiguracionapi
 */
describe('LeerConfiguracionapiComponent', () => {
  // Variables para el componente y su fixture
  let component: LeerConfiguracionapiComponent;
  let fixture: ComponentFixture<LeerConfiguracionapiComponent>;

  /**
   * Configuración asíncrona del entorno de pruebas
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeerConfiguracionapiComponent ],
      imports: [ 
        ReactiveFormsModule,      // Para manejo de formularios reactivos
        FormlyModule.forRoot()    // Para formularios dinámicos
      ],
      providers: [ ConfiguracionApiService ]  // Servicio necesario
    })
    .compileComponents();
  });

  /**
   * Creación y configuración del componente antes de cada test
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(LeerConfiguracionapiComponent);
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
