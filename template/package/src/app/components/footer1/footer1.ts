import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-footer1',
  templateUrl: './footer1.html',
  standalone: true,
  imports: [MatIcon],
  styleUrls: ['./footer1.scss']
})
export class Footer1Component {
  constructor(private router: Router) {}

  irALogin(): void {
    this.router.navigate(['/authentication/login']);
  }
}
