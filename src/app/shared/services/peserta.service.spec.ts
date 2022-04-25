import { TestBed } from '@angular/core/testing';

import { PesertaService } from './peserta.service';

describe('PesertaService', () => {
  let service: PesertaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PesertaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
