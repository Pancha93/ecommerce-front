import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service.service';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
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
import { OrdenlaboratorioService } from '../../../services/OrdenlaboratorioService';

interface OrdenlaboratorioModel {
  nombre: string;
  record: string;
  rx: string;
  piezas: number;
  shade: string;
  lab: string;
  fechaEnvio: Date;
  fechaEntrega: Date;
  factura: string;
  monto: number;
  pay: string;
  cheque: string;
  creador: string;
}

@Component({
  selector: 'app-crear-ordenlaboratorio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    FormlyMatDatepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
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
  templateUrl: './crear-ordenlaboratorio.component.html',
  styleUrls: ['./crear-ordenlaboratorio.component.scss']
})
export class CrearOrdenlaboratorioComponent implements OnInit {
  form = new FormGroup({});
  model: OrdenlaboratorioModel = {
    nombre: '',
    record: '',
    rx: '',
    piezas: 0,
    shade: '',
    lab: '',
    fechaEnvio: new Date(),
    fechaEntrega: new Date(),
    factura: '',
    monto: 0,
    pay: '',
    cheque: '',
    creador: ''
  };
  fields: FormlyFieldConfig[] = [];
  cargando = false;
  constructor(
    private dialogRef: MatDialogRef<CrearOrdenlaboratorioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ordenlaboratorioService: OrdenlaboratorioService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const username = this.authService.getUsername();
    this.model.creador = username;
    this.fields = [
      {
        key: 'nombre',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Nombre',
          placeholder: 'Ingrese nombre',
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
        key: 'record',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Record',
          placeholder: 'Ingrese record',
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
        key: 'rx',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Rx',
          placeholder: 'Ingrese rx',
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
        key: 'piezas',
        type: 'number',
        className: 'field-container',
        templateOptions: {
          label: 'Piezas',
          placeholder: 'Ingrese piezas',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          min: -2147483648,
          max: 2147483647,
          step: 1
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      },
      {
        key: 'shade',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Shade',
          placeholder: 'Ingrese shade',
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
        key: 'lab',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Lab',
          placeholder: 'Ingrese lab',
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
        key: 'fechaEnvio',
        type: 'datepicker',
        className: 'field-container',
        templateOptions: {
          label: 'Fecha Envio',
          placeholder: 'Ingrese fecha Envio',
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
        key: 'fechaEntrega',
        type: 'datepicker',
        className: 'field-container',
        templateOptions: {
          label: 'Fecha Entrega',
          placeholder: 'Ingrese fecha Entrega',
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
        key: 'factura',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Factura',
          placeholder: 'Ingrese factura',
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
        key: 'monto',
        type: 'number',
        className: 'field-container',
        templateOptions: {
          label: 'Monto',
          placeholder: 'Ingrese monto',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          },
          min: -1.7976931348623157e+308,
          max: 1.7976931348623157e+308,
          step: 0.001
        },
        validation: {
          messages: {
            pattern: 'Formato inválido'
          }
        }
      },
      {
        key: 'pay',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Pay',
          placeholder: 'Ingrese pay',
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
        key: 'cheque',
        type: 'input',
        className: 'field-container',
        templateOptions: {
          label: 'Cheque',
          placeholder: 'Ingrese cheque',
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
      }
    ];

  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.preCreate(this.model);

    // 2. Copiamos el modelo para no mutarlo directamente
    const modelData = { ...this.model };
    // Si no hay archivos a subir o no es un campo file, guardamos directo
    this.saveEntity(modelData);
  }

  private saveEntity(modelData: any) {
     this.ordenlaboratorioService.save(modelData).subscribe({
       next: (response) => {
         this.postCreate(response);
       },
       error: (error) => {
         console.error('Error al crear Ordenlaboratorio:', error);
         this.snackBar.open('Error al crear Ordenlaboratorio', 'Cerrar', {
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
    this.snackBar.open('Ordenlaboratorio creado exitosamente', 'Cerrar', {
      duration: 3000,
    });
    this.dialogRef.close(true);
    console.log('Acciones postCreate completadas.');
  }
}
