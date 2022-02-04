import { TestBed } from '@angular/core/testing';

import { RegistrasiService } from './registrasi.service';

describe('RegistrasiService', () => {
  let service: RegistrasiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrasiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
