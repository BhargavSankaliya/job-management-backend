import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { noWhitespaceValidator } from 'app/shared/common.service';
import { notification } from 'assets/notifications.library';
import { MenusService } from '../menus.service';
import { InputTextComponent } from 'app/CommonComponent/input-text/input-text.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-menu-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextComponent],
  templateUrl: './menu-create.component.html',
  styleUrl: './menu-create.component.scss'
})
export class MenuCreateComponent {

  menuCreateForm: FormGroup;
  isEdit: boolean = false;
  menuId: any;

  constructor(public location: Location, public router: Router, public menuService: MenusService, public route: ActivatedRoute, public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.defaultForm()

    let check: any = this.route.snapshot.paramMap.get('menuId');
    if (!!check) {
      this.isEdit = true;
      this.menuId = this.route.snapshot.paramMap.get('menuId');
      this.getMenuDetailsById()
    }

  }

  async getMenuDetailsById() {
    let machineDetails = await this.menuService.menuDetailsById(this.menuId);
    if (machineDetails.meta.code == 200) {
      this.menuCreateForm.patchValue(machineDetails.data);
    }
  }


  defaultForm() {
    this.menuCreateForm = this.formBuilder.group({
      name: ['', [Validators.required, noWhitespaceValidator]],
      icon: ['', [Validators.required, noWhitespaceValidator]],
      url: ['', [Validators.required, noWhitespaceValidator]],
      parentMenu: [''],
    })
  }

  async createMenus() {
    if (this.menuCreateForm.invalid) {
      notification('error', 'Please Fill Menu form properly', 1000);
      return
    }

    let object: any = {
      name: this.menuCreateForm.value.name,
      icon: this.menuCreateForm.value.icon,
      url: this.menuCreateForm.value.url,
      parentMenu: this.menuCreateForm.value.parentMenu,
    }

    let createStore = await this.menuService.menuCreate(this.menuId, object);
    if (createStore.meta.code == 200) {
      notification('success', createStore.meta.message, 1000);
      this.router.navigateByUrl('admin/auth/menus');
      this.menuService.menuLists = []
    }
  }
}
