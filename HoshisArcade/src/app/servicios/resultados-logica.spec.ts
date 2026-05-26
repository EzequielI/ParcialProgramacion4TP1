import { TestBed } from '@angular/core/testing';

import { ResultadosLogica } from './resultados-logica';

describe('ResultadosLogica', () => {
  let service: ResultadosLogica;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultadosLogica);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
