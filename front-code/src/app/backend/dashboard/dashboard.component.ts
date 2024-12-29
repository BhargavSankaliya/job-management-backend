import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import flatpickr from 'flatpickr';
import moment from 'moment';
import { DashboardService } from './dashboard.service';
import { NgIf } from '@angular/common';
import { UserService } from '../users/user.service';
import { DropdownComponent } from 'app/CommonComponent/dropdown/dropdown.component';
import { TableDynamicComponent } from 'app/CommonComponent/table-dynamic/table-dynamic.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, DropdownComponent, TableDynamicComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit, OnInit {

  startDatePicker: any;
  endDatePicker: any;

  constructor(public fb: FormBuilder, public dashboardService: DashboardService, public userService: UserService) {
    this.changeDatePicker()
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

  ngAfterViewInit(): void {
    // Initialize the start date picker
    this.startDatePicker = flatpickr('#flatpickr-start-date', {
      defaultDate: moment().startOf('week').toDate(),
      dateFormat: 'd-m-Y',  // Format as 'DD-MM-YYYY'
      onChange: (selectedDates, dateStr, instance) => {
        // Dynamically update the minimum date of the end date picker based on the selected start date
        if (selectedDates.length > 0) {
          this.endDatePicker.set('minDate', moment(selectedDates[0]).toDate());
          this.getCounts()
        }
      }
    });

    // Initialize the end date picker
    this.endDatePicker = flatpickr('#flatpickr-end-date', {
      defaultDate: moment().endOf('week').toDate(),
      dateFormat: 'd-m-Y',  // Format as 'DD-MM-YYYY'
      minDate: new Date(),  // Initially disable previous dates (same as start date)
      onChange: () => {
        this.getCounts()
      }
    });

  }

  ngOnInit(): void {
    this.defaultForm();
    this.getUserList();
  }

  dashboardForm: FormGroup;
  taskCounts: any
  userList: any[] = [];
  taskList: any[] = [];
  headerData: any[] = [
    { key: 'jobNo', name: 'JOB NO.' },
    { key: 'userName', name: 'USERNAME' },
    { key: 'counter', name: 'COUNTER' },
    { key: 'partyName', name: 'PARTY NAME' },
    { key: 'jobName', name: 'JOB NAME' },
    { key: 'taskPriority', name: 'PRIORITY' },
    { key: 'taskStatus', name: 'STATUS' },
  ]
  priorityList: any[] = [
    { name: "Low", value: 1 },
    { name: "Medium", value: 2 },
    { name: "High", value: 3 },
  ]
  taskStatus: any[] = [
    { name: "ToDo", value: 'ToDo' },
    { name: "Progress", value: 'Progress' },
    { name: "Completed", value: 'Completed' },
  ]

  defaultForm() {
    this.dashboardForm = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      userId: [null],
      status: [null],
      priority: [null]
    })
  }

  async getUserList() {
    let users: any[] = await this.userService.getUserList(false);
    this.userList = users;
    this.getCounts();

  }

  async getCounts() {
    let object = {
      startDate: moment(this.startDatePicker.selectedDates && this.startDatePicker.selectedDates[0] ? moment(this.startDatePicker.selectedDates[0]).startOf('day').toDate() : moment().startOf('week').toDate()).toDate(),
      endDate: moment(this.endDatePicker.selectedDates && this.endDatePicker.selectedDates[0] ? moment(this.endDatePicker.selectedDates[0]).endOf('day').toDate() : moment().endOf('week').toDate()).toDate(),
      userId: this.dashboardForm.value.userId,
      taskStatus: this.dashboardForm.value.status,
      taskPriority: this.dashboardForm.value.priority,
    }

    let count = await this.dashboardService.getCountForTask(object);
    this.taskCounts = count;
    if (count.taskListByUserId.length > 0) {
      count.taskListByUserId.map((x) => {
        x.taskPriority = x.taskPriority == 1 ? 'Low' : x.taskPriority == 2 ? 'Medium' : "High"
      })
    }
    this.taskList = count.taskListByUserId
  }

}
