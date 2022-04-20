import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerawatComponent } from './perawat.component';

describe('PerawatComponent', () => {
  let component: PerawatComponent;
  let fixture: ComponentFixture<PerawatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerawatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerawatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
