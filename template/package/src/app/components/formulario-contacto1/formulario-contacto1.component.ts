import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-formulario-contacto1',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './formulario-contacto1.component.html',
  styleUrls: ['./formulario-contacto1.component.scss']
})
export class FormularioContacto1Component {}