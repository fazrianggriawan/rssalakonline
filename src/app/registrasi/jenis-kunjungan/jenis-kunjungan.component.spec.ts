import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisKunjunganComponent } from './jenis-kunjungan.component';

describe('JenisKunjunganComponent', () => {
  let component: JenisKunjunganComponent;
  let fixture: ComponentFixture<JenisKunjunganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JenisKunjunganComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JenisKunjunganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
