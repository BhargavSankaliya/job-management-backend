import { Location, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextComponent } from 'app/CommonComponent/input-text/input-text.component';
import { TaskService } from '../task.service';
import { noWhitespaceValidator } from 'app/shared/common.service';
import { notification } from 'assets/notifications.library';
import { CategoryService } from '../category/category.service';
import { DropdownComponent } from 'app/CommonComponent/dropdown/dropdown.component';
import { UserService } from 'app/backend/users/user.service';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextComponent, DropdownComponent, NgFor, NgClass, NgIf],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss'
})
export class TaskCreateComponent {
  taskCreateForm: FormGroup;
  isEdit: boolean = false;
  taskId: any;
  categoryList: any[] = [];
  userList: any[] = [];

  constructor(public location: Location, public userService: UserService, public router: Router, public categoryService: CategoryService, public taskService: TaskService, public route: ActivatedRoute, public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.defaultForm();
    this.getCategoryList(false);
    this.getUserList(false);

    let check: any = this.route.snapshot.paramMap.get('taskId');
    if (!!check) {
      this.isEdit = true;
      this.taskId = this.route.snapshot.paramMap.get('taskId');
      this.getTaskDetailsById()
    }

  }

  async getCategoryList(force: boolean) {
    let categories: any[] = await this.categoryService.categoryList(force);
    categories.map((x) => {
      if (x.type == 'checkbox') {
        x.isChecked = false
      }
      else {
        x.value = ''
      }
    })

    this.categoryList = categories
  }

  async getUserList(force: boolean) {
    let users: any[] = await this.userService.getUserList(force);
    users.map((x) => {
      x.fullName = x.firstName + " " + x.lastName
    })
    this.userList = users
  }

  async getTaskDetailsById() {
    let taskDetails = await this.taskService.taskDetailsById(this.taskId);
    if (taskDetails.meta.code == 200) {
      taskDetails.data.counter = taskDetails.data.counter.toString();
      // taskDetails.data.taskPriority = taskDetails.data.taskPriority.toString();
      this.taskCreateForm.patchValue(taskDetails.data);

      if (taskDetails.data.category && taskDetails.data.category.length > 0) {
        taskDetails.data.category.map((x) => {
          let findCategory = this.categoryList.findIndex((y) => y._id == x.categoryId);
          if (findCategory != -1) {
            if (this.categoryList[findCategory].type == 'checkbox') {
              this.categoryList[findCategory].isChecked = true
            }
            else {
              this.categoryList[findCategory].value = x.value
            }

          }
        })
      }

    }
  }


  defaultForm() {
    this.taskCreateForm = this.formBuilder.group({
      counter: ['', [Validators.required, noWhitespaceValidator]],
      taskPriority: [10, [Validators.required]],
      partyName: ['', [Validators.required, noWhitespaceValidator]],
      jobName: ['', [Validators.required, noWhitespaceValidator]],
      size: [''],
      operator: [''],
      transportation: [''],
      Note: [''],
      assignUserId: [null, [Validators.required]]
    })
  }

  async createTask() {
    if (this.taskCreateForm.invalid) {
      notification('error', 'Please Fill Task form properly', 1000);
      return
    }

    let selectedCategory: any[] = [];
    this.categoryList.map((x) => {
      if ((x.type == 'checkbox' && x.isChecked) || (x.type == 'text' && !!x.value)) {
        selectedCategory.push({
          categoryId: x._id,
          value: x.type == 'checkbox' ? 'true' : x.value
        })
      }
    })

    let object: any = {
      counter: this.taskCreateForm.value.counter,
      partyName: this.taskCreateForm.value.partyName,
      jobName: this.taskCreateForm.value.jobName,
      size: this.taskCreateForm.value.size,
      operator: this.taskCreateForm.value.operator,
      transportation: this.taskCreateForm.value.transportation,
      Note: this.taskCreateForm.value.Note,
      assignUserId: this.taskCreateForm.value.assignUserId,
      category: selectedCategory.length > 0 ? selectedCategory : []
    }

    let createUpdateRole = await this.taskService.taskCreate(this.taskId, object);
    if (createUpdateRole.meta.code == 200) {
      notification('success', createUpdateRole.meta.message, 1000);
      this.router.navigateByUrl('admin/task/list');
      this.taskService.taskLists = []
    }
  }
}
