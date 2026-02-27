/**
 * Componente para mostrar servicios o beneficios.
 * Inputs:
 *  - titulo: string (opcional, por defecto "Servicios")
 *  - servicios: Array<{ icono: string; titulo: string; descripcion: string }>
 *    Ejemplo:
 *    servicios = [
 *      { icono: 'security', titulo: 'Seguridad', descripcion: 'Protegemos tu info' }
 *    ];
 * Si no se envía, se usan valores por defecto.
 */
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-seccion-servicios',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule],
  templateUrl: './seccion-servicios.component.html',
  styleUrls: ['./seccion-servicios.component.scss']
})
export class SeccionServiciosComponent {
  @Input() titulo: string = 'Servicios';
  @Input() servicios: { icono: string; titulo: string; descripcion: string }[] = [
    { icono: 'support_agent', titulo: 'Soporte 24/7', descripcion: 'Siempre disponibles para ayudarte.' },
    { icono: 'verified', titulo: 'Calidad Garantizada', descripcion: 'Altos estándares de servicio.' },
    { icono: 'security', titulo: 'Seguridad', descripcion: 'Protegemos tu información y negocio.' }
  ];
}