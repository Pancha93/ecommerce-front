// branding.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { logoProyecto } from '../../../pages/home/dataHome';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
      <a [routerLink]="['/']">
        <img
          [src]="logo"
          class="align-middle m-2"
          alt="logo"
          style="width: 100px; height: 100px; object-fit: contain;"
        />
      </a>
    </div>
  `,
})
export class BrandingComponent{
  logo = logoProyecto;

  constructor() {}
}
