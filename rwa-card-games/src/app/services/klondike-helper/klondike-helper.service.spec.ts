import { TestBed } from '@angular/core/testing';

import { KlondikeHelperService } from './klondike-helper.service';

describe('KlondikeHelperService', () => {
  let service: KlondikeHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KlondikeHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
