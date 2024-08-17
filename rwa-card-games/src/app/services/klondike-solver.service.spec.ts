import { TestBed } from '@angular/core/testing';

import { KlondikeSolverService } from './klondike-solver.service';

describe('KlondikeSolverService', () => {
  let service: KlondikeSolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KlondikeSolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
