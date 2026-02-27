import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogActions,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { NgForOf } from "@angular/common";

@Component({
  selector: 'app-download-file-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    NgForOf
  ],
  template: `
    <h1 mat-dialog-title class="file-name">Selecciona uno o varios archivos</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%">
        <mat-label class="file-name">Archivos</mat-label>
        <mat-select [(value)]="selectedFiles" multiple>
          <mat-option *ngFor="let file of files" [value]="file" class="file-name">
            {{ file }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button class="boton-crud-cancel" (click)="onCancel()">Cancelar</button>
      <button mat-button class="boton-crud" class="mat-mdc-button" (click)="onDownload()">Descargar</button>
    </div>
  `,
  styles: [`
    @import '../assets/scss/variables.scss';

    .file-name {
      font-family: $font-family !important;
    }

    .mat-mdc-button {
      font-family: $font-family-secondary !important;
    }
  `]
})
export class DownloadFileComponent implements OnInit {
  files: string[] = [];
  selectedFiles: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DownloadFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data && this.data.files) {
      this.files = this.data.files;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDownload(): void {
    this.dialogRef.close(this.selectedFiles);
  }
}
