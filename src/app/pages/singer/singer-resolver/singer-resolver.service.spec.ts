import { TestBed } from '@angular/core/testing';

import { SingerResolverService } from './singer-resolver.service';

describe('SingerResolverService', () => {
  let service: SingerResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingerResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
