import { TestBed } from '@angular/core/testing';

import { ProfessorChoicesService } from './professor-choices.service';

describe('ProfessorChoicesService', () => {
  let service: ProfessorChoicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfessorChoicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
