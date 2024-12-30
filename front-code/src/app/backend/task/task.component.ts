import { AfterViewInit, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SearchInputComponent } from 'app/CommonComponent/search-input/search-input.component';
import { TableDynamicComponent } from 'app/CommonComponent/table-dynamic/table-dynamic.component';
import { DeleteData, DeleteModalComponent } from '../common-modal/delete-modal/delete-modal.component';
import { notification } from 'assets/notifications.library';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from './task.service';
import moment from 'moment'
import { DropdownComponent } from 'app/CommonComponent/dropdown/dropdown.component';
import { FormControl } from '@angular/forms';
import flatpickr from 'flatpickr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [RouterLink, TableDynamicComponent, SearchInputComponent, DropdownComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements AfterViewInit {
  headerData: any[] = [
    { key: 'jobNo', name: 'JOB NO.' },
    { key: 'counter', name: 'ESTIMATED COUNTER' },
    { key: 'partyName', name: 'PARTY NAME' },
    { key: 'jobName', name: 'JOB NAME' },
    { key: 'size', name: 'SIZE' },
    { key: 'operator', name: 'OPERATOR' },
    { key: 'date', name: 'DATE' },
    { key: 'taskPriority', name: 'PRIORITY' },
    { key: 'taskStatus', name: 'TASK STATUS' },
    { key: 'action', name: "ACTION" }
  ]
  allTaskList: any[] = [];
  taskList: any[] = [];

  startDatePicker: any;
  endDatePicker: any;

  constructor(public dialog: MatDialog, public taskService: TaskService, public router: Router) {
    this.changeDatePicker();
  }

  changeDatePicker() {
    // Initialize the start date picker
    this.startDatePicker = flatpickr('#flatpickr-start-date', {
      dateFormat: 'Y-m-d',  // Format as 'DD-MM-YYYY'
      minDate: moment().toDate(),  // Disable previous dates
      onChange: (selectedDates, dateStr, instance) => {
        // Dynamically update the minimum date of the end date picker based on the selected start date
        if (selectedDates.length > 0) {
          this.endDatePicker.set('minDate', moment().add(1, 'day').toDate());

        }
      }
    });

    // Initialize the end date picker
    this.endDatePicker = flatpickr('#flatpickr-end-date', {
      dateFormat: 'Y-m-d',  // Format as 'DD-MM-YYYY'
      minDate: new Date(),  // Initially disable previous dates (same as start date)
    });
  }

  ngOnInit(): void {
    this.getTaskList(false);
  }

  ngAfterViewInit(): void {
    // Initialize the start date picker
    this.startDatePicker = flatpickr('#flatpickr-start-date', {
      defaultDate: moment().startOf('week').toDate(),
      dateFormat: 'd-m-Y',  // Format as 'DD-MM-YYYY'
      onChange: (selectedDates, dateStr, instance) => {
        // Dynamically update the minimum date of the end date picker based on the selected start date
        if (selectedDates.length > 0) {
          this.endDatePicker.set('minDate', moment(selectedDates[0]).toDate());
          this.getTaskList(true)
        }
      }
    });

    // Initialize the end date picker
    this.endDatePicker = flatpickr('#flatpickr-end-date', {
      defaultDate: moment().endOf('week').toDate(),
      dateFormat: 'd-m-Y',  // Format as 'DD-MM-YYYY'
      minDate: new Date(),  // Initially disable previous dates (same as start date)
      onChange: () => {
        this.getTaskList(true)
      }
    });

  }

  searchFilter(search: any) {
    this.taskList = this.allTaskList.filter((x) => JSON.stringify(x).toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  }

  async getTaskList(force: boolean) {

    let object = {
      startDate: moment(this.startDatePicker.selectedDates && this.startDatePicker.selectedDates[0] ? moment(this.startDatePicker.selectedDates[0]).startOf('day').toDate() : moment().startOf('week').toDate()).toDate(),
      endDate: moment(this.endDatePicker.selectedDates && this.endDatePicker.selectedDates[0] ? moment(this.endDatePicker.selectedDates[0]).endOf('day').toDate() : moment().endOf('week').toDate()).toDate(),
    }

    let list = await this.taskService.getTaskList(force, object);
    if (list.length > 0) {
      this.allTaskList = list.map((x, i) => { return { ...x, date: moment(x.createdAt).format("DD/MM/yyyy"), srNo: i + 1, action: { edit: true, view: true }, taskPriority: x.taskPriority == 1 ? 'Low' : x.taskPriority == 2 ? 'Medium' : 'High' } })
      this.taskList = this.allTaskList;
    }
    else {
      this.taskList = [];
      this.allTaskList = [];
    }
  }

  edit(event: any) {
    this.router.navigateByUrl("/admin/task/list/update/" + event)
  }
  view(event: any) {
    this.router.navigateByUrl("/admin/task/list/view/" + event)
  }

  downloadExcel() {
    // Define static headers for non-category fields
    const baseHeaders = [
      { header: 'Job No.', key: 'jobNo', width: 20 },
      { header: 'Counter', key: 'counter', width: 20 },
      { header: 'Party Name', key: 'partyName', width: 30 },
      { header: 'Job Name', key: 'jobName', width: 30 },
      { header: 'Size', key: 'size', width: 30 },
      { header: 'Priority', key: 'taskPriority', width: 20 },
      { header: 'Status', key: 'taskStatus', width: 20 },
      { header: 'Assign User', key: 'userName', width: 30 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ];

    // Extract unique category names to use as dynamic headers
    const categoryNames = Array.from(
      new Set(
        this.taskList.flatMap(row => row.category?.map(cat => cat.name) || [])
      )
    );

    // Create headers for categories
    const categoryHeaders = categoryNames.map(name => ({
      header: name,
      key: name,
      width: 20,
    }));

    // Combine all headers
    const headers = [...baseHeaders, ...categoryHeaders];

    // Map data dynamically based on headers
    const mappedData = this.taskList.map((row) => {
      const formattedRow: any = {};

      headers.forEach((col) => {
        if (col.key === 'createdAt') {
          // Format the createdAt date
          formattedRow[col.header] = moment(row[col.key]).format("DD/MM/yyyy");
        } else if (categoryNames.includes(col.key)) {
          // Match the category name and assign its value
          const category = row.category?.find(cat => cat.name === col.key);
          formattedRow[col.header] = category?.value || ''; // Set empty string if not found
        } else {
          // Map other keys
          formattedRow[col.header] = row[col.key] || '';
        }
      });

      return formattedRow;
    });

    // Create worksheet and apply column widths
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
    worksheet['!cols'] = headers.map((col) => ({ wch: col.width }));

    // Create workbook and append worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate binary data and trigger download
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'DynamicExcel.xlsx');
  }


}
