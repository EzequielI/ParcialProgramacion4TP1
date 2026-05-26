import { TestBed } from '@angular/core/testing';

import { PreguntadosLogica } from './preguntados-logica';

describe('PreguntadosLogica', () => {
  let service: PreguntadosLogica;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreguntadosLogica);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
