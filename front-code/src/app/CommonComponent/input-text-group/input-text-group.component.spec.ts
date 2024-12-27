import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextGroupComponent } from './input-text-group.component';

describe('InputTextGroupComponent', () => {
  let component: InputTextGroupComponent;
  let fixture: ComponentFixture<InputTextGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputTextGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
