import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrasiOnlineComponent } from './registrasi-online.component';

describe('RegistrasiOnlineComponent', () => {
  let component: RegistrasiOnlineComponent;
  let fixture: ComponentFixture<RegistrasiOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrasiOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrasiOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
