import { Location, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { noWhitespaceValidator } from 'app/shared/common.service';
import { notification } from 'assets/notifications.library';
import { RolesService } from '../roles.service';
import { InputTextComponent } from 'app/CommonComponent/input-text/input-text.component';
import { MenusService } from 'app/backend/menus/menus.service';

@Component({
  selector: 'app-role-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextComponent, NgFor],
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.scss'
})
export class RoleCreateComponent {
  roleCreateForm: FormGroup;
  isEdit: boolean = false;
  roleId: any;
  menuLists: any[] = [];

  constructor(public location: Location, public router: Router, public roleService: RolesService, public route: ActivatedRoute, public formBuilder: FormBuilder, public menuService: MenusService) { }

  ngOnInit(): void {
    this.defaultForm();
    this.getMenuList(false);

    let check: any = this.route.snapshot.paramMap.get('roleId');
    if (!!check) {
      this.isEdit = true;
      this.roleId = this.route.snapshot.paramMap.get('roleId');
      this.getRoleDetailsById()
    }

  }

  async getMenuList(force: boolean) {
    let menuList: any[] = await this.menuService.menuList(force);
    this.menuLists = menuList.map((x) => { x.isChecked = false; return x })
  }

  async getRoleDetailsById() {
    let roleDetails = await this.roleService.roleDetailsById(this.roleId);
    if (roleDetails.meta.code == 200) {
      this.roleCreateForm.patchValue(roleDetails.data);
      if (roleDetails.data.permission && roleDetails.data.permission.length > 0) {
        roleDetails.data.permission.map((x) => {
          let findIndex = this.menuLists.findIndex((y: any) => x.menuId == y._id);
          if (findIndex != -1) {
            this.menuLists[findIndex].isChecked = true
          }
        })
      }
    }
  }


  defaultForm() {
    this.roleCreateForm = this.formBuilder.group({
      name: ['', [Validators.required, noWhitespaceValidator]],
    })
  }

  async createRole() {
    if (this.roleCreateForm.invalid) {
      notification('error', 'Please Fill Role form properly', 1000);
      return
    }

    let checkPermission: any[] = []
    this.menuLists.map((x: any) => {
      if (x.isChecked) {
        checkPermission.push({
          menuId: x._id,
          isShow: x.isChecked
        })
      }
    })

    let object: any = {
      name: this.roleCreateForm.value.name,
      permission: checkPermission.length > 0 ? checkPermission : []
    }

    let createUpdateRole = await this.roleService.roleCreate(this.roleId, object);
    if (createUpdateRole.meta.code == 200) {
      notification('success', createUpdateRole.meta.message, 1000);
      this.router.navigateByUrl('admin/auth/roles');
      this.roleService.roleLists = []
    }
  }
}
