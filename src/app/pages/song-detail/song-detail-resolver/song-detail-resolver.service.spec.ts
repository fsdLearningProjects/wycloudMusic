import { TestBed } from '@angular/core/testing';

import { SongDetailResolverService } from './song-detail-resolver.service';

describe('SongDetailResolverService', () => {
  let service: SongDetailResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongDetailResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
