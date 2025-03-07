import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, DoCheck, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationLimitComponent } from '../pagination-limit/pagination-limit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { getSessionData, StorageKey } from 'app/Providers/http-service/urls.service';

@Component({
  selector: 'app-table-dynamic',
  standalone: true,
  imports: [NgClass, NgIf, NgFor, NgSwitch, NgSwitchCase, MatTooltipModule, NgSwitchDefault, NgxPaginationModule, PaginationLimitComponent],
  templateUrl: './table-dynamic.component.html',
  styleUrl: './table-dynamic.component.scss'
})
export class TableDynamicComponent implements OnInit, OnChanges, DoCheck {
  //header array
  @Input() headers: headersData[] = [];

  @Input() sortKey: string[] = [];
  headersLength: number = 0;

  @Input() tablePaginationId: string;

  // table list array
  @Input() tableData: any[] = [];
  allTableData: any[] = [];

  // sort table columns array
  @Input() sortableColumns: boolean[] = [];
  @Input() switchIconList: boolean[] = [];


  // if any routing in column then add it otherwise set all false
  @Input() routableColumns: boolean[] = [];

  // for show status budge style
  @Input() statusBudge: boolean[] = [];


  @Output() columnSort = new EventEmitter<any>();

  @Output() checkSelectedDefaultAddress = new EventEmitter<any>();

  @Output() clickViewIcon = new EventEmitter<any>();

  @Output() clickdeleteIcon = new EventEmitter<any>();

  @Output() clickDownloadIcon = new EventEmitter<any>();

  @Output() clickEditIcon = new EventEmitter<any>();


  @Output() dotsIconsEvent = new EventEmitter<any>();
  isDropdownOpen: boolean[] = [];


  constructor(private elementRef: ElementRef, public router: Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.allTableData = this.tableData;
    this.headersLength = this.headers.length;
    this.pageSize = 10;

    this.route.queryParams.subscribe(params => {
      if (params['page']) {
        this.currentPage = +params['page']; // Convert to number
      }
    });

  }

  ngDoCheck(): void {
    this.allTableData = this.tableData;

    const tabledataLength = getSessionData(StorageKey.listNumber);
    if (tabledataLength <= (this.pageSize * this.currentPage)) {
      this.currentPage = 1;
      // this.pageChange()
    }

    this.route.queryParams.subscribe(params => {
      const pagedataLength = params['page'] ? (JSON.parse(params['page']) - 1) * this.pageSize : this.pageSize;
      if (params['page'] && tabledataLength >= this.pageSize && tabledataLength > pagedataLength) {
        this.currentPage = +params['page']; // Convert to number
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tableData.length <= this.pageSize) {
      this.currentPage = 1
    }
    this.route.queryParams.subscribe(params => {
      if (params['page']) {
        this.currentPage = +params['page']; // Convert to number
      }
    });
  }

  toggle() {
    const dotBoxes = this.elementRef.nativeElement.querySelectorAll('.dot-box');
    const dropdownMenus = this.elementRef.nativeElement.querySelectorAll('.dropdown-menu');

    dotBoxes.forEach(dotBox => {
      dotBox.addEventListener('click', () => {
        const nextDropdownMenu = dotBox.nextElementSibling;
        const isOpen = nextDropdownMenu.classList.contains('show');

        // Close all dropdown menus
        dropdownMenus.forEach(menu => menu.classList.remove('show'));

        if (!isOpen && nextDropdownMenu && nextDropdownMenu.classList.contains('dropdown-menu')) {
          // Open the clicked dropdown if it's not already open
          nextDropdownMenu.classList.add('show');
        }
      });
    });
  }

  selectDefaultAddress(event: any, id: any) {
    this.checkSelectedDefaultAddress.emit(id);
  }


  selectView(columnData: any) {
    this.clickViewIcon.emit(columnData)
  }
  selectEdit(index: any) {
    this.clickEditIcon.emit(index)
  }

  selectDelete(index: any) {
    this.clickdeleteIcon.emit(index)
  }

  selectDownload(index: any) {
    this.clickDownloadIcon.emit(index)
  }

  @Input() currentPage: number = 1;
  pageSize: number = 0;

  changePageSize(event: number) {
    this.currentPage = 1;
    this.pageSize = event;
  }

  currentSortColumn: any;
  isAsc: boolean;

  sortByColumn(index: number) {
    const columnName = this.sortKey[index];

    if (!!columnName) {
      // Check if the current sorting column is the same as the last one
      if (this.currentSortColumn === columnName) {
        // Toggle the sorting order
        this.isAsc = !this.isAsc;
      } else {
        // If it's a new column, set the sorting order to ascending
        this.isAsc = true;
      }
      // Update the current sorting column
      this.currentSortColumn = columnName;

      // Perform sorting
      this.tableData.sort((a, b) => {
        const valueA = typeof (a[columnName]) == 'string' ? a[columnName].toLowerCase() : a[columnName];
        const valueB = typeof (b[columnName]) == 'string' ? b[columnName].toLowerCase() : b[columnName];

        return compare(valueA, valueB, this.isAsc);
      });
    }

  }

  pageChange() {
    this.router.navigate([], {
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge' // Keep other query parameters
    });
  }

}

function compare(a: any, b: any, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

export interface headersData {
  key: string,
  name: string
}