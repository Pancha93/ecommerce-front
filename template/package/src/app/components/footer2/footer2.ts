import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-footer2',
  templateUrl: './footer2.html',
  standalone: true,
  imports: [MatIcon],
  styleUrls: ['./footer2.scss']
})
export class Footer2Component {
  constructor(private router: Router) {}

  irALogin(): void {
    this.router.navigate(['/authentication/login']);
  }
}
