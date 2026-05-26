import { TestBed } from '@angular/core/testing';

import { WordleLogica } from './wordle-logica';

describe('WordleLogica', () => {
  let service: WordleLogica;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordleLogica);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
