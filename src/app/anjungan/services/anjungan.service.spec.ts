import { TestBed } from '@angular/core/testing';

import { AnjunganService } from './anjungan.service';

describe('AnjunganService', () => {
  let service: AnjunganService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnjunganService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
