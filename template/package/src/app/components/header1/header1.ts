import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-header1',
  templateUrl: './header1.html',
  standalone: true,
  imports: [
    MatIcon,
    MatToolbar,
    MatIconButton,
    MatButton,
    NgIf
  ],
  styleUrls: ['./header1.scss']
})
export class Header1Component {
  mobileMenuOpen = false;

  constructor(private router: Router) {}

  irALogin(): void {
    this.router.navigate(['/authentication/login']);
    this.mobileMenuOpen = false;
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
