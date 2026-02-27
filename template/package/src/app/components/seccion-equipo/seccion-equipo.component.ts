/**
 * Este componente muestra un equipo de trabajo.
 * Inputs:
 *  - titulo: string (opcional, por defecto "Equipo")
 *  - equipo: Array<{ nombre: string; rol: string; foto: string }>
 */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-seccion-equipo',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './seccion-equipo.component.html',
  styleUrls: ['./seccion-equipo.component.scss']
})
export class SeccionEquipoComponent {
  @Input() titulo: string = 'Equipo';
  @Input() equipo: { nombre: string; rol: string; foto: string }[] = [
    { nombre: 'Ana Torres', rol: 'Gerente', foto: 'assets/images/home/equipo.png' },
    { nombre: 'Carlos Ríos', rol: 'Diseñador', foto: 'assets/images/home/equipo.png' },
    { nombre: 'Luisa Gómez', rol: 'Desarrolladora', foto: 'assets/images/home/equipo.png' }
  ];
}
