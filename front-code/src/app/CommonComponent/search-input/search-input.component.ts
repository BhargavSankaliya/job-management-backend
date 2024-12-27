import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [NgIf, FormsModule, DirectivesModule, ReactiveFormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {

  @Input() search: any = '';
  @Input() class: string = '';
  @Input() placeHolder: string = '';
  @Output() searchData = new EventEmitter<any>();

  searchTerm() {
    this.searchData.emit(this.search);
  }

}
