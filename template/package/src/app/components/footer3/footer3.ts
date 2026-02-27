import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-footer3',
  templateUrl: './footer3.html',
  standalone: true,
  imports: [MatIcon],
  styleUrls: ['./footer3.scss']
})
export class Footer3Component {
  constructor(private router: Router) {}

  irALogin(): void {
    this.router.navigate(['/authentication/login']);
  }
}
