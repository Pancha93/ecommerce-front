import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { DateTime } from 'luxon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfiguracionApiService } from '../../../services/ConfiguracionApiService';
import Swal from 'sweetalert2';

interface ConfiguracionApiModel {
  /** id de la entidad */
  id: number;
  /** nombreApi de la entidad */
  nombreApi: string;
  /** urlBase de la entidad */
  urlBase: string;
  /** endpointLogin de la entidad */
  endpointLogin: string;
  /** campoUsuario de la entidad */
  campoUsuario: string;
  /** usuario de la entidad */
  usuario: string;
  /** password de la entidad */
  password: string;
  /** activo de la entidad */
  activo: boolean;
  /** descripcion de la entidad */
  descripcion: string;
  /** entidadAsociada de la entidad */
  entidadAsociada: string;
  /** metodosSoportados de la entidad */
  metodosSoportados: string;
  /** camposInterfaz de la entidad */
  camposInterfaz: string;
  /** creador de la entidad */
  creador: string;
}

/**
 * Componente para la actualización de ConfiguracionApi
 * @description Maneja el formulario de actualización utilizando Formly
 */
@Component({
  selector: 'app-actualizar-configuracionapi',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './actualizar-configuracionapi.component.html',
  styleUrls: ['./actualizar-configuracionapi.component.scss']
})
export class ActualizarConfiguracionApiComponent implements OnInit {
  /** Lista de todas las entidades */
  configuracionapis: any[] = [];
  /** Entidad seleccionada para actualizar */
  selectedConfiguracionApi: any = null;
  form = new FormGroup({});
  model: ConfiguracionApiModel = {} as ConfiguracionApiModel;
  originalModel: ConfiguracionApiModel = {} as ConfiguracionApiModel;
  fields: FormlyFieldConfig[] = [];

  /**
   * Constructor del componente
   * @param configuracionapiService Servicio principal de la entidad
   * @param router Servicio de enrutamiento
   * @param data Datos recibidos por el diálogo
   * @param dialogRef Referencia al diálogo
   */
  constructor(
    private configuracionapiService: ConfiguracionApiService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ActualizarConfiguracionApiComponent>
  ) {}

  /** Inicialización del componente */
  ngOnInit() {
    this.loadConfiguracionApis();

    if (this.data) {
      try {
        this.selectedConfiguracionApi = { ...this.data };
        // Inicializar modelo con los datos recibidos
        this.model = {
          id: this.data.id,
          nombreApi: this.data.nombreApi,
          urlBase: this.data.urlBase,
          endpointLogin: this.data.endpointLogin,
          campoUsuario: this.data.campoUsuario,
          usuario: this.data.usuario,
          password: this.data.password,
          activo: this.data.activo,
          descripcion: this.data.descripcion,
          entidadAsociada: this.data.entidadAsociada,
          metodosSoportados: this.data.metodosSoportados,
          camposInterfaz: this.data.camposInterfaz,
          creador: this.data.creador
        };

        // Copia del modelo original para detectar cambios
        this.originalModel = {
          id: this.data.id,
          nombreApi: this.data.nombreApi,
          urlBase: this.data.urlBase,
          endpointLogin: this.data.endpointLogin,
          campoUsuario: this.data.campoUsuario,
          usuario: this.data.usuario,
          password: this.data.password,
          activo: this.data.activo,
          descripcion: this.data.descripcion,
          entidadAsociada: this.data.entidadAsociada,
          metodosSoportados: this.data.metodosSoportados,
          camposInterfaz: this.data.camposInterfaz,
          creador: this.data.creador
        };
      } catch (error) {
        console.error('Error al procesar datos:', error);
      }
    }
    this.generateFormFields();
  }

  /** Carga la lista de entidades disponibles */
  loadConfiguracionApis() {
    this.configuracionapiService.findAll().subscribe(
      data => this.configuracionapis = data,
      error => console.error(error)
    );
  }

  /**
   * Actualiza las opciones de un campo tipo select en el formulario
   */
  private updateFieldOptions(key: string, options: any[]) {
    const field = this.fields.find(f => f.key === key);
    if (field && field.templateOptions) {
      field.templateOptions.options = options;
    }
  }

  /**
   * Maneja la edición de un registro existente
   */
  onEdit(configuracionapi: any) {
    this.selectedConfiguracionApi = { ...configuracionapi };
    this.model = { ...this.selectedConfiguracionApi };
    this.generateFormFields();
  }

  /**
   * Genera la configuración de campos del formulario
   */
  generateFormFields() {
    this.fields = [
      {
        key: 'nombreApi',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'NombreApi',
          placeholder: 'Ingrese nombreApi',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      },
      {
        key: 'urlBase',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'UrlBase',
          placeholder: 'Ingrese urlBase',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      },
      {
        key: 'endpointLogin',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'EndpointLogin',
          placeholder: 'Ingrese endpointLogin',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      },
      {
        key: 'campoUsuario',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'CampoUsuario',
          placeholder: 'Ingrese campoUsuario',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      },
      {
        key: 'usuario',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Usuario',
          placeholder: 'Ingrese usuario',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      },
      {
        key: 'password',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Password',
          placeholder: 'Ingrese password',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      },
      {
        key: 'activo',
        type: 'select',
        className: 'field-container',
        templateOptions: {
          label: 'Activo',
          placeholder: 'Ingrese activo',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          options: [{ value: true, label: 'Activo' }, { value: false, label: 'Inactivo' }]
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      },
      {
        key: 'descripcion',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Descripcion',
          placeholder: 'Ingrese descripcion',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      },
      {
        key: 'entidadAsociada',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'EntidadAsociada',
          placeholder: 'Ingrese entidadAsociada',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      },
      {
        key: 'metodosSoportados',
        type: 'textarea',
        className: 'field-container',
        templateOptions: {
          label: 'MetodosSoportados',
          placeholder: 'Ingrese metodosSoportados',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          rows: 5
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      },
      {
        key: 'camposInterfaz',
        type: 'textarea',
        className: 'field-container',
        templateOptions: {
          label: 'CamposInterfaz',
          placeholder: 'Ingrese camposInterfaz',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          rows: 5
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      },
      {
        key: 'creador',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Creador',
          placeholder: 'Ingrese creador',
          required: false,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      }
    ];
  }

  onSubmit() {
    // 1. Acciones previas
    this.preUpdate(this.model);

    const modelData = { ...this.model };

    // Si no se subieron archivos, procedemos a actualizar directamente
    this.updateEntity(modelData);
  }

  private updateEntity(modelData: any) {
    // Asumimos que modelData.id existe en tu modelo para saber cuál actualizar.
    this.configuracionapiService.update(modelData.id, modelData).subscribe({
      next: (response) => {
        this.postUpdate(response);
      },
      error: (error) => {
        console.error('Error al actualizar ConfiguracionApi:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar ConfiguracionApi',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--colorBoton)'
        });
      },
    });
  }

  cancelEdit() {
    this.dialogRef.close();
  }

  /**
   * Verifica si hay cambios entre el model actual y el original.
   */
  private hasChanges(model: ConfiguracionApiModel): boolean {
    for (const key in model) {
      const keyTyped = key as keyof ConfiguracionApiModel;
      const newValue = typeof model[keyTyped] === 'string' ? (model[keyTyped] as string).trim() : model[keyTyped];
      const originalValue = typeof this.originalModel[keyTyped] === 'string' ? (this.originalModel[keyTyped] as string).trim() : this.originalModel[keyTyped];

      if (Array.isArray(newValue) && Array.isArray(originalValue)) {
        if (newValue.length !== originalValue.length ||
            newValue.some((item, index) => item.id !== originalValue[index]?.id)) {
          return true; // Cambios en arrays
        }
      } else if (newValue !== originalValue) {
        return true; // Cambio en valor simple
      }
    }
    return false; // No hay cambios
  }

  /**
   * Método para acciones previas a actualizar ConfiguracionApi.
   */
  preUpdate(model: any) {
    // Verificar si el formulario es válido
    if (!this.form.valid) {
      throw new Error('El formulario no es válido.');
    }

    // Verificar si hubo cambios
    if (!this.hasChanges(model)) {
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'No se han realizado cambios en ConfiguracionApi.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'var(--colorBoton)',
      });
      throw new Error('No se han realizado cambios en el registro.');
    }

    // Quitar espacios al inicio y final
    for (const key in model) {
      if (typeof model[key] === 'string') {
        model[key] = model[key].trim();
      }
    }

    // TODO: Verificar permisos si se requiere
    console.log('Validaciones de preUpdate completadas.');
  }

  /**
   * Método para acciones posteriores al actualizar ConfiguracionApi.
   */
  postUpdate(response: any) {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'ConfiguracionApi actualizado exitosamente',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--colorBoton)',
      timer: 3000,
      timerProgressBar: true
    });
    this.dialogRef.close(true);
    console.log('Acciones postUpdate completadas.');
  }

  /**
   * Extrae los nombres de archivos de una cadena que puede tener varias rutas separadas por comas.
   * @param paths Cadena de rutas.
   * @returns Una cadena con los nombres de archivos.
   */
  getFileNames(paths: string): string {
    if (!paths) { return ''; }
    return paths.split(',')
      .map(item => item.trim())
      .map(path => {
        const lastBackslash = path.lastIndexOf('\\');
        const lastSlash = path.lastIndexOf('/');
        const lastSeparator = Math.max(lastBackslash, lastSlash);
        return lastSeparator === -1 ? path : path.substring(lastSeparator + 1);
      })
      .join(', ');
  }

}
