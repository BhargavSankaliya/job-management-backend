import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import flatpickr from 'flatpickr';
import moment from 'moment';
import { DashboardService } from './dashboard.service';
import { NgIf } from '@angular/common';
import { UserService } from '../users/user.service';
import { DropdownComponent } from 'app/CommonComponent/dropdown/dropdown.component';
import { TableDynamicComponent } from 'app/CommonComponent/table-dynamic/table-dynamic.component';
import { getSessionData, setSessionData, StorageKey } from 'app/Providers/http-service/urls.service';
import { TaskService } from '../task/task.service';
import { Router } from '@angular/router';

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
  jobNo: any = '';
  userName: any = '';
  counter: any = '';
  partyName: any = '';
  jobName: any = '';
  dateObject = {
    startDate: moment().startOf('week').format("yyyy-MM-DD"),
    endDate: moment().endOf('week').format("yyyy-MM-DD")
  }

  constructor(public fb: FormBuilder, public router: Router, public dashboardService: DashboardService, public taskService: TaskService, public userService: UserService) {

    this.dateObject = {
      startDate: moment().startOf('week').format("yyyy-MM-DD"),
      endDate: moment().endOf('week').format("yyyy-MM-DD")
    }
  }

  async getDate() {

    let date = await this.taskService.getDateFromDB();
    if (date) {
      this.dateObject = date;

      this.dashboardForm.controls['startDate'].setValue(moment(date.startDate).format("yyyy-MM-DD"));
      this.dashboardForm.controls['endDate'].setValue(moment(date.endDate).format("yyyy-MM-DD"));

      this.getUserList();

    }
    else {
      this.saveDate(this.dateObject);
      this.getDate()
    }

  }

  async saveDate(object: any) {

    let date = await this.taskService.saveDateInDB(object);

    this.dashboardForm.controls['startDate'].setValue(moment(date.startDate).format("yyyy-MM-DD"));
    this.dashboardForm.controls['endDate'].setValue(moment(date.endDate).format("yyyy-MM-DD"));

  }


  getCategoryString(category: any) {
    let processList: any = '';
    if (category && category.length > 0) {
      category.map((x, i) => {
        if (x.type == 'checkbox') {
          processList = processList + `<div>${i + 1}. ${x.name}</div>`
        }
        else {
          processList = processList + `<div>${i + 1}. ${x.name} ${x.value ? '- ' + x.value : ''}</div>`
        }
      })
    }
    return processList
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.defaultForm();
    this.getDate();
  }

  dashboardForm: FormGroup;
  taskCounts: any
  userList: any[] = [];
  taskList: any[] = [];
  allTaskList: any[] = [];
  headerData: any[] = [
    { key: 'jobNo', name: 'JOB NO.' },
    { key: 'userName', name: 'USERNAME' },
    { key: 'counter', name: 'COUNTER' },
    { key: 'partyName', name: 'PARTY NAME' },
    { key: 'jobName', name: 'JOB NAME' },
    { key: 'size', name: 'SIZE' },
    { key: 'operator', name: 'OPERATOR' },
    { key: 'createdAt', name: 'DATE' },
    { key: 'taskPriority', name: 'PRIORITY' },
    { key: 'finalCounter', name: 'FINAL COUNTER' },
    { key: 'process', name: 'PROCESS' },
    { key: 'taskStatus', name: 'STATUS' },
    { key: 'action', name: 'ACTION' },
  ]
  priorityList: any[] = [
    { name: "Low", value: 1 },
    { name: "Medium", value: 2 },
    { name: "High", value: 3 },
  ]
  taskStatus: any[] = [
    { name: "ToDo", value: 'ToDo' },
    { name: "Progress", value: 'Progress' },
    { name: "Dispatch", value: 'Dispatch' },
    { name: "Billing", value: 'Billing' },
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
      startDate: moment(this.dashboardForm.value.startDate).startOf('day').toDate(),
      endDate: moment(this.dashboardForm.value.endDate).endOf('day').toDate(),
      userId: this.dashboardForm.value.userId,
      taskStatus: this.dashboardForm.value.status,
      taskPriority: this.dashboardForm.value.priority,
    }

    let count = await this.dashboardService.getCountForTask(object);
    this.taskCounts = count;
    if (count.taskListByUserId.length > 0) {
      count.taskListByUserId.map((x) => {
        x.createdAt = moment(x.createdAt).format("DD-MM-yyyy");
        x.taskPriority = x.taskPriority == 1 ? 'Low' : x.taskPriority == 2 ? 'Medium' : "High";
        x.process = this.getCategoryString(x.category);
        x.action = {
          view: true
        }
      })
    }
    this.taskList = count.taskListByUserId;
    this.allTaskList = this.taskList;

    setSessionData(StorageKey.listNumber, String(this.taskList.length));

    this.saveDate({
      startDate: object.startDate,
      endDate: object.endDate
    })


  }

  view(event: any) {
    this.router.navigateByUrl("/admin/task/list/view/" + event)
  }

  searchFilter() {
    let tempTaskAllList = JSON.parse(JSON.stringify(this.allTaskList));

    if (this.jobNo) {
      tempTaskAllList = tempTaskAllList.filter((x) => x.jobNo.includes(this.jobNo))
    }

    if (this.userName) {
      tempTaskAllList = tempTaskAllList.filter((x) => x.userName.toLocaleLowerCase().includes(this.userName.toLocaleLowerCase()))
    }

    if (this.counter) {
      tempTaskAllList = tempTaskAllList.filter((x) => x.counter.toLocaleLowerCase().includes(this.counter.toLocaleLowerCase()))
    }

    if (this.partyName) {
      tempTaskAllList = tempTaskAllList.filter((x) => x.partyName.toLocaleLowerCase().includes(this.partyName.toLocaleLowerCase()))
    }

    if (this.jobName) {
      tempTaskAllList = tempTaskAllList.filter((x) => x.jobName.toLocaleLowerCase().includes(this.jobName.toLocaleLowerCase()))
    }

    this.taskList = tempTaskAllList
    setSessionData(StorageKey.listNumber, String(this.taskList.length));

  }

}
