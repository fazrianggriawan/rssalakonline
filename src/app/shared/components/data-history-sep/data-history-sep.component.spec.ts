import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataHistorySepComponent } from './data-history-sep.component';

describe('DataHistorySepComponent', () => {
  let component: DataHistorySepComponent;
  let fixture: ComponentFixture<DataHistorySepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataHistorySepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataHistorySepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
