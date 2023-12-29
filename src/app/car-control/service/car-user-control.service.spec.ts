import { TestBed } from '@angular/core/testing';

import { CarUserControlService } from './car-user-control.service';

describe('CarUserControlService', () => {
  let service: CarUserControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarUserControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
