/**
 * Este componente recibe un input llamado `clientes`.
 * Formato esperado: [{ nombre: 'Nombre del cliente', imagen: './cliente.png' }]
 */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-grid-clientes',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './grid-clientes.component.html',
  styleUrls: ['./grid-clientes.component.scss']
})
export class GridClientesComponent {
  @Input() clientes: { nombre: string, imagen: string }[] = [
    { nombre: 'Cliente 1', imagen: 'assets/images/home/cliente.png' },
    { nombre: 'Cliente 2', imagen: 'assets/images/home/cliente.png' },
    { nombre: 'Cliente 3', imagen: 'assets/images/home/cliente.png' }
  ];
}
