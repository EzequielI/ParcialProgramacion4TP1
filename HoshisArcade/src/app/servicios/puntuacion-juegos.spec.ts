import { TestBed } from '@angular/core/testing';

import { PuntuacionJuegos } from './puntuacion-juegos';

describe('PuntuacionJuegos', () => {
  let service: PuntuacionJuegos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuntuacionJuegos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
