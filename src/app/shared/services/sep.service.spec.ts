import { TestBed } from '@angular/core/testing';

import { SepService } from './sep.service';

describe('SepService', () => {
  let service: SepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
