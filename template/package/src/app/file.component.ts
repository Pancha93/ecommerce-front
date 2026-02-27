import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'formly-field-file',
  template: `
    <mat-form-field appearance="outline" class="file-field">\n      <mat-label>{{ to.placeholder }}</mat-label>\n      <input type="text" matInput [value]="displayValue" readonly />\n\n      <input type="file" #fileInput [formlyAttributes]="field" (change)="onChange($event)" [accept]="to['accept']" [multiple]="to['multiple']" hidden />\n\n      <button mat-button matSuffix type="button" (click)="fileInput.click()">\n        Seleccionar archivo\n      </button>\n    </mat-form-field>\n  `,
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormlyModule,
    MatButtonModule,
  ],
  styles: [`
    @import '../assets/scss/variables.scss';

    .file-field {
      width: 100%;
      margin: 10px 0;
      border-radius: 5px;
      font-family: $font-family !important;
    }

    ::ng-deep .file-field {
      .mat-mdc-form-field-label, .mat-mdc-input-element {
        font-family: $font-family !important;
      }

      .mat-mdc-button {
        font-family: $font-family-secondary !important;
      }
    }
  `]
})
export class FileComponent extends FieldType {
  /**
   * Devuelve la cadena que se mostrará en el input de sólo lectura.
   */
  get displayValue(): string {
    const val = this.formControl.value;
    if (!val) { return 'Ningún archivo seleccionado'; }

    if (!Array.isArray(val) && val?.name) { return val.name; }
    if (typeof val === 'string') { return val; }
    if (Array.isArray(val) && val.length > 0) {
      return val.map(file => file.name).join(', ');
    }
    return 'Ningún archivo seleccionado';
  }

  /**
   * Maneja el cambio de archivos (single/multiple).
   */
  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.to['multiple']) {
      const files = input.files ? Array.from(input.files) : [];
      this.formControl.setValue(files);
    } else {
      const file = input.files?.[0];
      if (file) { this.formControl.setValue(file); }
    }
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
  }
}
