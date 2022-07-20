import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRujukanComponent } from './data-rujukan.component';

describe('DataRujukanComponent', () => {
  let component: DataRujukanComponent;
  let fixture: ComponentFixture<DataRujukanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataRujukanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRujukanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
