import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QwertyComponent } from './qwerty.component';

describe('QwertyComponent', () => {
  let component: QwertyComponent;
  let fixture: ComponentFixture<QwertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QwertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QwertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
