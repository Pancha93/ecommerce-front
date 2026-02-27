/**
 * Componente de inicio que muestra la página principal de la aplicación
 * Incluye una sección de bienvenida y una lista de entidades disponibles
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {nombreAplicacion, descripcionAplicacion} from "../home/dataHome";

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,    // Módulo con componentes de Material Design
    CommonModule,      // Módulo con directivas comunes de Angular
    RouterLink         // Directiva para navegación entre rutas
  ],
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StarterComponent {
  nombreAplicacion = nombreAplicacion;
  descripcion = descripcionAplicacion;
}