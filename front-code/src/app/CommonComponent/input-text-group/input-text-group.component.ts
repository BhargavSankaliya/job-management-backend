import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-text-group',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './input-text-group.component.html',
  styleUrl: './input-text-group.component.scss'
})
export class InputTextGroupComponent {
  @Input() control: FormControl | any;
  @Input() control2: FormControl | any;
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() type2: string = 'text';
  @Input() class: string = '';
  @Input() placeholder: string = '';
  @Input() placeholder2: string = '';
  @Input() required: boolean = false;
  @Input() required2: boolean = false;
  @Input() readonly: boolean = false;
  @Input() readonly2: boolean = false;

  constructor() { }

  ngOnInit() { }

  displayErrors() {
    const { dirty, touched, errors } = this.control;
    return (dirty && errors) || (touched && errors);
  }
}
