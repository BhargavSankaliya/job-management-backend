import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationLimitComponent } from './pagination-limit.component';

describe('PaginationLimitComponent', () => {
  let component: PaginationLimitComponent;
  let fixture: ComponentFixture<PaginationLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationLimitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaginationLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
