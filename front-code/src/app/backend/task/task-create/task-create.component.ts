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
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { environment } from 'environments/environment';
import moment from 'moment';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextComponent, DropdownComponent, NgFor, NgClass, NgIf, MatAutocompleteModule],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss'
})
export class TaskCreateComponent {
  taskCreateForm: FormGroup;
  isEdit: boolean = false;
  taskId: any;
  categoryList: any[] = [];
  userList: any[] = [];
  priorityList: any[] = [
    { name: "Low", value: 1 },
    { name: "Medium", value: 2 },
    { name: "High", value: 3 },
  ];
  partyNameList: any[] = [];
  jobNameList: any[] = [];
  sizeList: any[] = [];
  operatorList: any[] = [];
  transportationList: any[] = [];
  latestCounter: Number = 0;

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
    else {
      this.fetchCounter()
    }
  }

  async fetchCounter() {
    let counter = await this.taskService.latestCounter();
    this.latestCounter = counter;
  }

  ngAfterViewInit(): void {
    this.taskCreateForm.controls['partyName'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(value => value ? this.taskService.getPartyName('partyName', value) : [])
    ).subscribe(data => {
      let list: any[] = data;
      this.partyNameList = list;
    });

    this.taskCreateForm.controls['jobName'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(value => value ? this.taskService.getPartyName('jobName', value) : [])
    ).subscribe(data => {
      let list: any[] = data;
      this.jobNameList = list;
    });

    this.taskCreateForm.controls['size'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(value => value ? this.taskService.getPartyName('size', value) : [])
    ).subscribe(data => {
      let list: any[] = data;
      this.sizeList = list;
    });

    this.taskCreateForm.controls['operator'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(value => value ? this.taskService.getPartyName('operator', value) : [])
    ).subscribe(data => {
      let list: any[] = data;
      this.operatorList = list;
    });

    this.taskCreateForm.controls['transportation'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(value => value ? this.taskService.getPartyName('transportation', value) : [])
    ).subscribe(data => {
      let list: any[] = data;
      this.transportationList = list;
    });
  }

  async getCategoryList(force: boolean) {
    let categories: any[] = await this.categoryService.activeCategoryList(force);
    categories.map((x) => {
      if (x.status == 'Active') {
        if (x.type == 'checkbox') {
          x.isChecked = false
        }
        else {
          x.value = ''
        }
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

      this.imagePreview = taskDetails.data.initialImage ? environment.apiUrl + 'uploads/initialImage/' + taskDetails.data.initialImage : '';
      this.selectedFile = taskDetails.data.initialImage ? taskDetails.data.initialImage : "";
      this.latestCounter = taskDetails.data.jobNo;
      if (!!taskDetails.data.appEstimatedDate) {
        console.log(new Date(taskDetails.data.appEstimatedDate));

        this.taskCreateForm.controls["appEstimatedDate"].setValue(moment(taskDetails.data.appEstimatedDate).format("yyyy-MM-DD"));
      }

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
      taskPriority: [2, [Validators.required]],
      partyName: ['', [Validators.required, noWhitespaceValidator]],
      jobName: ['', [Validators.required, noWhitespaceValidator]],
      size: [''],
      operator: [''],
      transportation: [''],
      Note: [''],
      isHold: [false],
      isCancel: [false],
      appEstimatedDate: [null],
      appEstimatedTime: [null],
      assignUserId: [null, [Validators.required]]
    })
  }

  updateCategoryCheck(event: any, index: number) {
    if (event.target.checked) {
      this.categoryList[index].isChecked = true
    }
    else {
      this.categoryList[index].isChecked = false
    }
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

    if (selectedCategory.length == 0) {
      notification("error", "Please Select at least one Category", 1000);
      return
    }

    if (!this.selectedFile) {
      notification("error", "Please Upload Initial Image.", 1000);
      return
    }

    let object: FormData = new FormData();
    object.append("counter", this.taskCreateForm.value.counter);
    object.append("partyName", this.taskCreateForm.value.partyName);
    object.append("jobName", this.taskCreateForm.value.jobName);
    object.append("size", this.taskCreateForm.value.size);
    object.append("taskPriority", this.taskCreateForm.value.taskPriority);
    object.append("operator", this.taskCreateForm.value.operator);
    object.append("transportation", this.taskCreateForm.value.transportation);
    object.append("Note", this.taskCreateForm.value.Note);
    object.append("appEstimatedDate", this.taskCreateForm.value.appEstimatedDate);
    object.append("appEstimatedTime", this.taskCreateForm.value.appEstimatedTime);
    object.append("isHold", this.taskCreateForm.value.isHold);
    object.append("isCancel", this.taskCreateForm.value.isCancel);
    object.append("assignUserId", this.taskCreateForm.value.assignUserId);
    object.append("category", JSON.stringify(selectedCategory.length > 0 ? selectedCategory : []));
    object.append("initialImage", this.selectedFile ? this.selectedFile : null);

    let createUpdateRole = await this.taskService.taskCreate(this.taskId, object);
    if (createUpdateRole.meta.code == 200) {
      notification('success', createUpdateRole.meta.message, 1000);
      this.location.back();
      this.taskService.taskLists = []
    }
  }

  selectedFile: any; // Holds the selected file
  imagePreview: string | null = null; // Holds the image preview URL

  // Handles single file selection and generates an image preview
  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Store the selected file
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          this.imagePreview = e.target.result as string; // Set the image preview URL
        }
      };
      reader.readAsDataURL(this.selectedFile); // Read the file as a Data URL
    }

    // Clear the input value to allow re-upload of the same file
    input.value = '';
  }

  clearFile(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }
}
