import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomorAntrianComponent } from './nomor-antrian.component';

describe('NomorAntrianComponent', () => {
  let component: NomorAntrianComponent;
  let fixture: ComponentFixture<NomorAntrianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NomorAntrianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NomorAntrianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
