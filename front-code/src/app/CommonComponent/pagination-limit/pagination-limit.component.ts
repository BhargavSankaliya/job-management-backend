import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination-limit',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './pagination-limit.component.html',
  styleUrl: './pagination-limit.component.scss'
})
export class PaginationLimitComponent {


  @Input() itemPerPage: number = 0
  @Output() optionSelected = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {

  }

  selectValue() {
    this.optionSelected.emit(this.itemPerPage)
  }

}
