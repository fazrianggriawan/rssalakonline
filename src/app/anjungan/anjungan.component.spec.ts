import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnjunganComponent } from './anjungan.component';

describe('AnjunganComponent', () => {
  let component: AnjunganComponent;
  let fixture: ComponentFixture<AnjunganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnjunganComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnjunganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
