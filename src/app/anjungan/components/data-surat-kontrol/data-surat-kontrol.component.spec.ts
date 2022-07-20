import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSuratKontrolComponent } from './data-surat-kontrol.component';

describe('DataSuratKontrolComponent', () => {
  let component: DataSuratKontrolComponent;
  let fixture: ComponentFixture<DataSuratKontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSuratKontrolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSuratKontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
