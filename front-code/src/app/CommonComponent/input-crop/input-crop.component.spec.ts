import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCropComponent } from './input-crop.component';

describe('InputCropComponent', () => {
  let component: InputCropComponent;
  let fixture: ComponentFixture<InputCropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCropComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
