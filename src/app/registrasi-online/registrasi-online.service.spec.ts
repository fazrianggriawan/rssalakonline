import { TestBed } from '@angular/core/testing';

import { RegistrasiOnlineService } from './registrasi-online.service';

describe('RegistrasiOnlineService', () => {
  let service: RegistrasiOnlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrasiOnlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
