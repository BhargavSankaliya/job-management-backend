import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../shared/directives/directives.module';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [NgIf, FormsModule, DirectivesModule, ReactiveFormsModule],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
})
export class InputTextComponent implements OnInit {

  @Input() control: FormControl | any;
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() class: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() minDate: any = null;
  @Input() invalid: boolean = false;


  @Output() changeInput = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  displayErrors() {
    const { dirty, touched, errors } = this.control;
    return (dirty && errors) || (touched && errors);
  }

  changes() {
    this.changeInput.emit()
  }

}
