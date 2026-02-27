import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  /** id de la entidad */
  id: number;
  /** nombre de la entidad */
  nombre: string;
  /** record de la entidad */
  record: string;
  /** rx de la entidad */
  rx: string;
  /** piezas de la entidad */
  piezas: number;
  /** shade de la entidad */
  shade: string;
  /** lab de la entidad */
  lab: string;
  /** fechaEnvio de la entidad */
  fechaEnvio: Date;
  /** fechaEntrega de la entidad */
  fechaEntrega: Date;
  /** factura de la entidad */
  factura: string;
  /** monto de la entidad */
  monto: number;
  /** pay de la entidad */
  pay: string;
  /** cheque de la entidad */
  cheque: string;
  /** creador de la entidad */
  creador: string;
}

/**
 * Componente para la actualización de Ordenlaboratorio
 * @description Maneja el formulario de actualización utilizando Formly
 */
@Component({
  selector: 'app-actualizar-ordenlaboratorio',
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
  templateUrl: './actualizar-ordenlaboratorio.component.html',
  styleUrls: ['./actualizar-ordenlaboratorio.component.scss']
})
export class ActualizarOrdenlaboratorioComponent implements OnInit {
  /** Lista de todas las entidades */
  ordenlaboratorios: any[] = [];
  /** Entidad seleccionada para actualizar */
  selectedOrdenlaboratorio: any = null;
  form = new FormGroup({});
  model: OrdenlaboratorioModel = {} as OrdenlaboratorioModel;
  originalModel: OrdenlaboratorioModel = {} as OrdenlaboratorioModel;
  fields: FormlyFieldConfig[] = [];

  /**
   * Constructor del componente
   * @param ordenlaboratorioService Servicio principal de la entidad
   * @param router Servicio de enrutamiento
   * @param snackBar Servicio para notificaciones
   * @param data Datos recibidos por el diálogo
   * @param dialogRef Referencia al diálogo
   */
  constructor(
    private ordenlaboratorioService: OrdenlaboratorioService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ActualizarOrdenlaboratorioComponent>
  ) {}

  /** Inicialización del componente */
  ngOnInit() {
    this.loadOrdenlaboratorios();

    if (this.data) {
      try {
        this.selectedOrdenlaboratorio = { ...this.data };
        // Inicializar modelo con los datos recibidos
        this.model = {
          id: this.data.id,
          nombre: this.data.nombre,
          record: this.data.record,
          rx: this.data.rx,
          piezas: this.data.piezas,
          shade: this.data.shade,
          lab: this.data.lab,
          fechaEnvio: this.data.fechaEnvio,
          fechaEntrega: this.data.fechaEntrega,
          factura: this.data.factura,
          monto: this.data.monto,
          pay: this.data.pay,
          cheque: this.data.cheque,
          creador: this.data.creador
        };

        // Copia del modelo original para detectar cambios
        this.originalModel = {
          id: this.data.id,
          nombre: this.data.nombre,
          record: this.data.record,
          rx: this.data.rx,
          piezas: this.data.piezas,
          shade: this.data.shade,
          lab: this.data.lab,
          fechaEnvio: this.data.fechaEnvio,
          fechaEntrega: this.data.fechaEntrega,
          factura: this.data.factura,
          monto: this.data.monto,
          pay: this.data.pay,
          cheque: this.data.cheque,
          creador: this.data.creador
        };
      } catch (error) {
        console.error('Error al procesar datos:', error);
      }
    }
    this.generateFormFields();
  }

  /** Carga la lista de entidades disponibles */
  loadOrdenlaboratorios() {
    this.ordenlaboratorioService.findAll().subscribe(
      data => this.ordenlaboratorios = data,
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
  onEdit(ordenlaboratorio: any) {
    this.selectedOrdenlaboratorio = { ...ordenlaboratorio };
    this.model = { ...this.selectedOrdenlaboratorio };
    this.generateFormFields();
  }

  /**
   * Genera la configuración de campos del formulario
   */
  generateFormFields() {
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
          label: 'FechaEnvio',
          placeholder: 'Ingrese fechaEnvio',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
          }
        }
      },
      {
        key: 'fechaEntrega',
        type: 'datepicker',
        className: 'field-container',
        templateOptions: {
          label: 'FechaEntrega',
          placeholder: 'Ingrese fechaEntrega',
          required: true,
          appearance: 'outline',
          floatLabel: 'always',
          attributes: {
            'class': 'modern-input'
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
    this.ordenlaboratorioService.update(modelData.id, modelData).subscribe({
      next: (response) => {
        this.postUpdate(response);
      },
      error: (error) => {
        console.error('Error al actualizar Ordenlaboratorio:', error);
        this.snackBar.open('Error al actualizar Ordenlaboratorio', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
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
  private hasChanges(model: OrdenlaboratorioModel): boolean {
    for (const key in model) {
      const keyTyped = key as keyof OrdenlaboratorioModel;
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
   * Método para acciones previas a actualizar Ordenlaboratorio.
   */
  preUpdate(model: any) {
    // Verificar si el formulario es válido
    if (!this.form.valid) {
      throw new Error('El formulario no es válido.');
    }

    // Verificar si hubo cambios
    if (!this.hasChanges(model)) {
      this.snackBar.open('No se han realizado cambios en Ordenlaboratorio.', 'Cerrar', {
        duration: 3000,
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
   * Método para acciones posteriores al actualizar Ordenlaboratorio.
   */
  postUpdate(response: any) {
    this.snackBar.open('Ordenlaboratorio actualizado exitosamente', 'Cerrar', {
      duration: 3000,
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
