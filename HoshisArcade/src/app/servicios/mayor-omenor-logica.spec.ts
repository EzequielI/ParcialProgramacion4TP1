import { TestBed } from '@angular/core/testing';

import { MayorOmenor } from './mayor-omenor-logica';

describe('MayorOmenor', () => {
  let service: MayorOmenor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MayorOmenor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
