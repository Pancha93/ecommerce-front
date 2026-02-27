import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule , ActivatedRoute} from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import {LoginTradicionalComponent} from "./login-tradicional/login-tradicional.component";
import{FooterComponent} from "../../../components/footer/footer.component";
import {
  SocialAuthService,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { MatCardModule } from '@angular/material/card';
import {environment} from "../../../../environments/environment";
import {PermissionService} from "../services/PermissionService";
import { logoProyecto } from '../../home/dataHome';
@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    LoginTradicionalComponent,
    FooterComponent
  ],
  templateUrl: './side-login.component.html',
  styleUrl: './side-login.component.scss',
  providers: [
    SocialAuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId),
          }
        ]
      }
    }
  ]
})
export class AppSideLoginComponent  implements OnInit{
  logo = logoProyecto;
  constructor() {
  }
  ngOnInit() {}
}
