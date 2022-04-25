import { TestBed } from '@angular/core/testing';

import { RujukanService } from './rujukan.service';

describe('RujukanService', () => {
  let service: RujukanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RujukanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
