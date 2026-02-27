import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { NgForOf } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'app-show-files-list',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    NgForOf,
    MatFormField
  ],
  template: `
    <h1 mat-dialog-title class="file-name">Archivos disponibles</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%">
        <mat-list-item *ngFor=\"let file of files\">
          <mat-icon matListItemIcon>insert_drive_file</mat-icon>
          <span matListItemTitle class="file-name">{{ file }}</span>
        </mat-list-item>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button class="boton-crud-cancel" (click)=\"onCancel()\">Cancelar</button>
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
export class ShowFilesListComponent implements OnInit {
  files: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ShowFilesListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data?.files) {
      this.files = this.data.files;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
