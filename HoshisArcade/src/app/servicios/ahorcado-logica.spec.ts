import { TestBed } from '@angular/core/testing';

import { AhorcadoLogica } from './ahorcado-logica';

describe('AhorcadoLogica', () => {
  let service: AhorcadoLogica;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AhorcadoLogica);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
