import { TestBed } from '@angular/core/testing';

import { CardResizeService } from './card-resize.service';

describe('CardResizeService', () => {
  let service: CardResizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardResizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
