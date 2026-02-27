import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service.service';
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
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { DateTime } from 'luxon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfiguracionApiService } from '../../../services/ConfiguracionApiService';

interface ConfiguracionApiModel {
  nombreApi: string;
  urlBase: string;
  endpointLogin: string;
  campoUsuario: string;
  usuario: string;
  password: string;
  activo: boolean;
  descripcion: string;
  entidadAsociada: string;
  metodosSoportados: string;
  camposInterfaz: string;
  creador: string;
}

@Component({
  selector: 'app-crear-configuracionapi',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    MatSnackBarModule,
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
    MatSnackBarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './crear-configuracionapi.component.html',
  styleUrls: ['./crear-configuracionapi.component.scss']
})
export class CrearConfiguracionApiComponent implements OnInit {
  form = new FormGroup({});
  model: ConfiguracionApiModel = {
    nombreApi: '',
    urlBase: '',
    endpointLogin: '',
    campoUsuario: '',
    usuario: '',
    password: '',
    activo: false,
    descripcion: '',
    entidadAsociada: '',
    metodosSoportados: '',
    camposInterfaz: '',
    creador: ''
  };
  fields: FormlyFieldConfig[] = [];

  constructor(
    private dialogRef: MatDialogRef<CrearConfiguracionApiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private configuracionApiService: ConfiguracionApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const username = this.authService.getUsername();
    this.model.creador = username;
    this.fields = [
      {
        key: 'nombreApi',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Nombre Api',
          placeholder: 'Ingrese nombre Api',
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
          label: 'Url Base',
          placeholder: 'Ingrese url Base',
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
          label: 'Endpoint Login',
          placeholder: 'Ingrese endpoint Login',
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
          label: 'Campo Usuario',
          placeholder: 'Ingrese campo Usuario',
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
          label: 'Entidad Asociada',
          placeholder: 'Ingrese entidad Asociada',
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
          label: 'Metodos Soportados',
          placeholder: 'Ingrese metodos Soportados',
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
          label: 'Campos Interfaz',
          placeholder: 'Ingrese campos Interfaz',
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
      }
    ];

  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    // 1. Validaciones previas
    this.preCreate(this.model);

    // 2. Copiamos el modelo para no mutarlo directamente
    const modelData = { ...this.model };
    // Si no hay archivos a subir o no es un campo file, guardamos directo
    this.saveEntity(modelData);
  }

  private saveEntity(modelData: any) {
    this.configuracionApiService.save(modelData).subscribe({
      next: (response) => {
        this.postCreate(response);
      },
      error: (error) => {
        console.error('Error al crear ConfiguracionApi:', error);
        this.snackBar.open('Error al crear ConfiguracionApi', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Método para las acciones previas a crear
   */
  preCreate(model: any) {
    if (!this.form.valid) {
      throw new Error('El formulario no es válido.');
    }

    // Quitar espacios al inicio y fin de cadenas
    for (const key in model) {
      if (typeof model[key] === 'string') {
        model[key] = model[key].trim();
      }
    }
    console.log('Validaciones de preCreate completadas.');
  }

  /**
   * Acciones que se ejecutan después de la creación
   */
  postCreate(response: any) {
    this.snackBar.open('ConfiguracionApi creado exitosamente', 'Cerrar', {
      duration: 3000,
    });
    this.dialogRef.close(true);
    console.log('Acciones postCreate completadas.');
  }
}
