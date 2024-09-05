import { TestBed } from '@angular/core/testing';

import { SolitaireHelperService } from './solitaire-helper.service';

describe('SolitaireHelperService', () => {
  let service: SolitaireHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolitaireHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
