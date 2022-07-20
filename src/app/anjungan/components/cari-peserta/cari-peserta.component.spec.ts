import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CariPesertaComponent } from './cari-peserta.component';

describe('CariPesertaComponent', () => {
  let component: CariPesertaComponent;
  let fixture: ComponentFixture<CariPesertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CariPesertaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CariPesertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
