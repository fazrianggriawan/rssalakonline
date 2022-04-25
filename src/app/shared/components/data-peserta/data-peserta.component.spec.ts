import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPesertaComponent } from './data-peserta.component';

describe('DataPesertaComponent', () => {
  let component: DataPesertaComponent;
  let fixture: ComponentFixture<DataPesertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPesertaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPesertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
