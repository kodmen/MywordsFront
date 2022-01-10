import { TestBed } from '@angular/core/testing';

import { DesteService } from './deste.service';

describe('DesteService', () => {
  let service: DesteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
