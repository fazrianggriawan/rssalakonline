import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CariBookingOnlineComponent } from './cari-booking-online.component';

describe('CariBookingOnlineComponent', () => {
  let component: CariBookingOnlineComponent;
  let fixture: ComponentFixture<CariBookingOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CariBookingOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CariBookingOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
