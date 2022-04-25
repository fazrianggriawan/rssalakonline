import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonfirmasiDataComponent } from './konfirmasi-data.component';

describe('KonfirmasiDataComponent', () => {
  let component: KonfirmasiDataComponent;
  let fixture: ComponentFixture<KonfirmasiDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KonfirmasiDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KonfirmasiDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
