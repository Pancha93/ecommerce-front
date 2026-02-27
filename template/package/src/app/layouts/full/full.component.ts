import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    CommonModule,
    HeaderComponent,
  ],
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FullComponent {
  constructor() {
    const htmlElement = document.querySelector('html')!;
    htmlElement.classList.add('light-theme');
  }
}
