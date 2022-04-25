import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilihJenisKunjunganComponent } from './pilih-jenis-kunjungan.component';

describe('PilihJenisKunjunganComponent', () => {
  let component: PilihJenisKunjunganComponent;
  let fixture: ComponentFixture<PilihJenisKunjunganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PilihJenisKunjunganComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilihJenisKunjunganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
