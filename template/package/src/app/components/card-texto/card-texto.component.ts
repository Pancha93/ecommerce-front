import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card-texto',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './card-texto.component.html',
  styleUrls: ['./card-texto.component.scss']
})
export class CardTextoComponent {
  @Input() titulo: string = '';
  @Input() descripcion: string = '';
}