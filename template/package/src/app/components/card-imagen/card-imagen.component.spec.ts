import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardImagenComponent } from './card-imagen.component';

describe('CardImagenComponent', () => {
  let component: CardImagenComponent;
  let fixture: ComponentFixture<CardImagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardImagenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
