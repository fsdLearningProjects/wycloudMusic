import { TestBed } from '@angular/core/testing';

import { HomeResolveService } from './home-resolve.service';

describe('HomeResolveService', () => {
  let service: HomeResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
