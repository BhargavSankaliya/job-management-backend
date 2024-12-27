import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location, NgClass, NgFor, NgIf } from '@angular/common';
import { TableDynamicComponent } from 'app/CommonComponent/table-dynamic/table-dynamic.component';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [NgIf, DatePipe, TableDynamicComponent, NgClass, NgFor],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent implements OnInit {

  taskDetails: TaskDetails
  taskId: any
  taskCommentList: TaskComments[];
  environmentBaseUrl = environment.apiUrl;

  headerData: any[] = [
    { key: 'userName', name: 'User Name' },
    { key: 'totalTime', name: 'Total Time' },
  ]
  workingUserTimeList: any[] = []

  constructor(public taskService: TaskService, public route: ActivatedRoute, public location: Location) {
    let check: any = this.route.snapshot.paramMap.get('taskId');
    this.taskId = check
  }

  ngOnInit(): void {
    this.getTaskDetailsById();
    this.getTaskCommentsById();
    this.getTaskUserTimeList();
  }

  async getTaskDetailsById() {
    let task: any = await this.taskService.taskViewDetailsById(this.taskId);
    this.taskDetails = task
  }

  async getTaskCommentsById() {
    let comments: TaskComments[] = await this.taskService.taskVieDetailsCommentById(this.taskId);
    this.taskCommentList = comments
  }

  async getTaskUserTimeList() {
    let users: any[] = await this.taskService.taskUserTimeList(this.taskId);
    this.workingUserTimeList = users
  }

}

export interface TaskDetails {
  _id: string
  counter: number
  jobNo: string
  partyName: string
  jobName: string
  size: string
  operator: string
  transportation: string
  Note: string
  assignUserId: string
  category: Category[]
  taskStatus: string
  completedPicture: string
  status: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
  __v: number
  taskPriority: number
  userDetails: UserDetails
  categoryDetails: CategoryDetail[]
}

export interface UserDetails {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  isVerified: boolean
  gender: string
  address: string
  profilePicture: string
  token: string
  roleId: string
  status: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
  __v: number
}

export interface Category {
  categoryId: string
  value: string
  _id: string
  name: string
  type: string
}

export interface CategoryDetail {
  _id: string
  name: string
  type: string
  status: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
  __v: number
}

export interface TaskComments {
  _id: string
  taskId: string
  taskStatus: string
  startTime: string
  endTime: string
  totalMinutes: number
  assignUserId: string
  comment: string
  status: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
  __v: number
  userDetails: UserDetails
}