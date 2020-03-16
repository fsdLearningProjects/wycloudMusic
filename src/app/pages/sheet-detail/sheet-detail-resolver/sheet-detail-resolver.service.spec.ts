import { TestBed } from '@angular/core/testing';

import { SheetDetailResolverService } from './sheet-detail-resolver.service';

describe('SheetDetailResolverService', () => {
  let service: SheetDetailResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SheetDetailResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
