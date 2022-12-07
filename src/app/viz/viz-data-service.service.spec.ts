import { TestBed } from '@angular/core/testing';

import { VizDataServiceService } from './viz-data-service.service';

describe('VizDataServiceService', () => {
  let service: VizDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VizDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
