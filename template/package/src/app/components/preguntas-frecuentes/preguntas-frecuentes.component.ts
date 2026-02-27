/**
 * Este componente recibe un input llamado `preguntas`.
 * El formato esperado es:
 * preguntas = [{ pregunta: '¿...? ', respuesta: '...' }, ...]
 * Si no se recibe este input, se usarán preguntas por defecto.
 */
import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-preguntas-frecuentes',
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, NgIf, NgFor],
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrls: ['./preguntas-frecuentes.component.scss']
})
export class PreguntasFrecuentesComponent {
  @Input() preguntas: { pregunta: string, respuesta: string }[] = [
    { pregunta: '¿Cómo puedo contactarlos?', respuesta: 'Puedes usar el formulario o escribirnos por correo.' },
    { pregunta: '¿Dónde están ubicados?', respuesta: 'Estamos en Colombia, pero atendemos en línea.' },
    { pregunta: '¿Ofrecen garantía?', respuesta: 'Sí, todos nuestros servicios tienen garantía de satisfacción.' }
  ];
}