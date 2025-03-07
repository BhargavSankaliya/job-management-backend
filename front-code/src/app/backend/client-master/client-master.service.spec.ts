import { TestBed } from '@angular/core/testing';

import { ClientMasterService } from './client-master.service';

describe('ClientMasterService', () => {
  let service: ClientMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
