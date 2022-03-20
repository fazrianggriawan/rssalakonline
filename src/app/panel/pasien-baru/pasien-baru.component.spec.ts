import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasienBaruComponent } from './pasien-baru.component';

describe('PasienBaruComponent', () => {
  let component: PasienBaruComponent;
  let fixture: ComponentFixture<PasienBaruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasienBaruComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasienBaruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
