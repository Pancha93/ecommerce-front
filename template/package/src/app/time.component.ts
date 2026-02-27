import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'formly-field-timepicker',
  template: `
    <mat-form-field appearance="outline" class="time-field">
      <mat-label>{{ to.label }}</mat-label>
      <input
        matInput
        [ngxTimepicker]="picker"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [placeholder]="to.placeholder"
        [required]="to.required"
        readonly
      />
      <ngx-material-timepicker #picker></ngx-material-timepicker>
      <button
        mat-icon-button
        matSuffix
        (click)="picker.open()"
        aria-label="Abrir selector de hora"
      >
        <mat-icon>access_time</mat-icon>
      </button>
    </mat-form-field>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormlyModule,
    NgxMaterialTimepickerModule,
    MatIconModule,
    MatButtonModule
  ],
  styles: [
    `
    .time-field {
      width: 100%;
      margin: 10px 0;
      background-color: #dee1ea;
      border-radius: 5px;
    }
  `
  ]
})
export class TimePickerComponent extends FieldType<any> {}
