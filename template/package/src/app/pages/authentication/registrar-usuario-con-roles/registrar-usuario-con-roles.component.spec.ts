import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarUsuarioConRolesComponent } from './registrar-usuario-con-roles.component';

describe('RegistrarUsuarioConRolesComponent', () => {
  let component: RegistrarUsuarioConRolesComponent;
  let fixture: ComponentFixture<RegistrarUsuarioConRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarUsuarioConRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarUsuarioConRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
