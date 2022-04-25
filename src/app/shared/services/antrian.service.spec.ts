import { TestBed } from '@angular/core/testing';

import { AntrianService } from './antrian.service';

describe('AntrianService', () => {
  let service: AntrianService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntrianService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
