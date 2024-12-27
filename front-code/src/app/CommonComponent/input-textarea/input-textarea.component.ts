import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'app/shared/directives/directives.module';

@Component({
  selector: 'app-input-textarea',
  standalone: true,
  imports: [NgIf, FormsModule, DirectivesModule, ReactiveFormsModule],
  templateUrl: './input-textarea.component.html',
  styleUrl: './input-textarea.component.scss'
})
export class InputTextareaComponent implements OnInit {

  @Input() control: FormControl | any;
  @Input() label: string = '';
  @Input() class: string = '';
  @Input() placeholder: string = '';
  @Input() rows: string = '5';
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  
  constructor() { }

  ngOnInit() { }

  displayErrors() {
    const { dirty, touched, errors } = this.control;
    return (dirty && errors) || (touched && errors);
  }
}
