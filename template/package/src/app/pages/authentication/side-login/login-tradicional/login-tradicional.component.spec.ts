import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTradicionalComponent } from './login-tradicional.component';

describe('LoginTradicionalComponent', () => {
  let component: LoginTradicionalComponent;
  let fixture: ComponentFixture<LoginTradicionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginTradicionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginTradicionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
