import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpjsComponent } from './bpjs.component';

describe('BpjsComponent', () => {
  let component: BpjsComponent;
  let fixture: ComponentFixture<BpjsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpjsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BpjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
