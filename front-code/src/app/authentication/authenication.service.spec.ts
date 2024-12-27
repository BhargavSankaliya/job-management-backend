import { TestBed } from '@angular/core/testing';

import { AuthenicationService } from './authenication.service';

describe('AuthenicationService', () => {
  let service: AuthenicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
