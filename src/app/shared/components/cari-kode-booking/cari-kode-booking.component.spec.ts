import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CariKodeBookingComponent } from './cari-kode-booking.component';

describe('CariKodeBookingComponent', () => {
  let component: CariKodeBookingComponent;
  let fixture: ComponentFixture<CariKodeBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CariKodeBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CariKodeBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
