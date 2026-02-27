// Importaciones de módulos de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
// Importaciones del componente y servicio a probar
import { CrearConfiguracionapiComponent } from './crear-configuracionapi.component';
import { ConfiguracionApiService } from '../../../services/ConfiguracionApiService';

/**
 * Suite de pruebas para el componente CrearConfiguracionapi
 */
describe('CrearConfiguracionapiComponent', () => {
  // Variables para el componente y su fixture
  let component: CrearConfiguracionapiComponent;
  let fixture: ComponentFixture<CrearConfiguracionapiComponent>;

  /**
   * Configuración asíncrona del entorno de pruebas
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearConfiguracionapiComponent ],
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
    fixture = TestBed.createComponent(CrearConfiguracionapiComponent);
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
