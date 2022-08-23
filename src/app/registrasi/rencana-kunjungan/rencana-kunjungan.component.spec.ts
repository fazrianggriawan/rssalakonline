import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RencanaKunjunganComponent } from './rencana-kunjungan.component';

describe('RencanaKunjunganComponent', () => {
  let component: RencanaKunjunganComponent;
  let fixture: ComponentFixture<RencanaKunjunganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RencanaKunjunganComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RencanaKunjunganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
