import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { CommonModule, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [DirectivesModule, NgIf, NgSelectModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements OnInit {

  @Input() key: string = 'name';
  @Input() value: string = 'value';
  @Input() isMultiple: boolean = false;
  @Input() isCloseOnSelect: boolean = true;
  @Input() clearable: boolean = false;
  @Input() searchable: boolean = false;

  @Input() dropdownData: any[] = [];

  @Input() control: FormControl = new FormControl('');
  @Input() label: string = '';
  @Input() placeholder: string = '';

  @Output() dropdownChanged = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  displayErrors() {
    const { dirty, touched, errors } = this.control;
    return dirty && touched && errors;
  }

  selectedValue() {
    this.dropdownChanged.emit(event);
  }

}
