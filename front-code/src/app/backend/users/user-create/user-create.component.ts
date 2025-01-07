import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextComponent } from 'app/CommonComponent/input-text/input-text.component';
import { UserService } from '../user.service';
import { noWhitespaceValidator } from 'app/shared/common.service';
import { notification } from 'assets/notifications.library';
import { DropdownComponent } from 'app/CommonComponent/dropdown/dropdown.component';
import { RolesService } from 'app/backend/roles/roles.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [InputTextComponent, FormsModule, ReactiveFormsModule, DropdownComponent],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss'
})
export class UserCreateComponent {
  userCreateForm: FormGroup;
  isEdit: boolean = false;
  userId: any;
  genderList: any[] = [
    { name: "Male", value: 'Male' },
    { name: "Female", value: 'Female' },
    { name: "Other", value: 'Other' },
  ];

  roleList: any[] = [];

  constructor(public location: Location, public roleService: RolesService, public router: Router, public userService: UserService, public route: ActivatedRoute, public formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.defaultForm();
    this.getRoleList(false);
    let check: any = this.route.snapshot.paramMap.get('userId');
    if (!!check) {
      this.isEdit = true;
      this.userId = this.route.snapshot.paramMap.get('userId');
      this.getUserDetailsById()
    }

  }

  async getRoleList(force: boolean) {
    this.roleList = await this.roleService.roleList(force);
  }

  async getUserDetailsById() {
    let userDetails = await this.userService.userDetailsById(this.userId);
    if (userDetails.meta.code == 200) {
      this.userCreateForm.patchValue(userDetails.data);
    }
  }


  defaultForm() {
    this.userCreateForm = this.formBuilder.group({
      firstName: ['', [Validators.required, noWhitespaceValidator]],
      lastName: ['', [Validators.required, noWhitespaceValidator]],
      email: ['', [Validators.required, noWhitespaceValidator]],
      phone: ['', [Validators.required, noWhitespaceValidator]],
      password: ['', [Validators.required, noWhitespaceValidator]],
      gender: [null, [Validators.required, noWhitespaceValidator]],
      address: ['', [Validators.required, noWhitespaceValidator]],
      roleId: [null, [Validators.required, noWhitespaceValidator]],
    })
  }

  async createUser() {
    if (this.userCreateForm.invalid) {
      notification('error', 'Please Fill User form properly', 1000);
      return
    }

    let object: any = {
      firstName: this.userCreateForm.value.firstName,
      lastName: this.userCreateForm.value.lastName,
      email: this.userCreateForm.value.email,
      phone: this.userCreateForm.value.phone,
      gender: this.userCreateForm.value.gender,
      address: this.userCreateForm.value.address,
      roleId: this.userCreateForm.value.roleId,
      password: this.userCreateForm.value.password
    }

    if (!this.userId) {
    }

    let createUpdateUser = await this.userService.userCreate(this.userId, object);
    if (createUpdateUser.meta.code == 200) {
      notification('success', createUpdateUser.meta.message, 1000);
      if (this.router.url.includes("profile")) {
        this.location.back()
      }
      else {
        this.router.navigateByUrl('admin/users');
      }
      this.userService.userLists = []
    }
  }
}
