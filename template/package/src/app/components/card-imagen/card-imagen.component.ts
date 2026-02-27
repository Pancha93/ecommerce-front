/**
 * Componente: card-imagen
 * Descripcion: este componente es una card con imagen, titulo y descripcion.
 *
 * Inputs:
 * - imagen: link de la imagen que se va a mostrar
 * - titulo: titulo para mostrar en la card
 * - descripcion: una breve descripcion de la imagen que se esta mostrando
 *
 * Ejemplo de uso:
 * <app-card-imagen
 *       [imagen]="'assets/images/banner/imagen.jpg'"
 *       [titulo]="'Imagen para mostrar'"
 *       [descripcion]="'descripción de la imagen a mostrar'"
 * ></app-card-imagen>
 */
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-card-imagen',
  standalone: true,
  imports: [MatCardModule, NgIf],
  templateUrl: './card-imagen.component.html',
  styleUrls: ['./card-imagen.component.scss']
})
export class CardImagenComponent  {
  @Input() imagen: string = '';
  @Input() titulo: string = '';
  @Input() descripcion: string = '';
}
