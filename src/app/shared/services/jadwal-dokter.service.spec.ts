import { TestBed } from '@angular/core/testing';

import { JadwalDokterService } from './jadwal-dokter.service';

describe('JadwalDokterService', () => {
  let service: JadwalDokterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JadwalDokterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
