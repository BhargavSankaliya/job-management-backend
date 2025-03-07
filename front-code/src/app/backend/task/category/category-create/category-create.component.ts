import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextComponent } from 'app/CommonComponent/input-text/input-text.component';
import { noWhitespaceValidator } from 'app/shared/common.service';
import { notification } from 'assets/notifications.library';
import { Location } from '@angular/common';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextComponent],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.scss'
})
export class CategoryCreateComponent {
  categoryCreateForm: FormGroup;
  isEdit: boolean = false;
  invalid: boolean = false;
  categoryId: any;
  menuLists: any[] = [];

  constructor(public location: Location, public router: Router, public categoryService: CategoryService, public route: ActivatedRoute, public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.defaultForm();

    let check: any = this.route.snapshot.paramMap.get('categoryId');
    if (!!check) {
      this.isEdit = true;
      this.categoryId = this.route.snapshot.paramMap.get('categoryId');
      this.getCategoryDetailsById()
    }

  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.altKey && event.key.toLowerCase() === 'b') {
      this.location.back();
    }
    if (event.altKey && event.key.toLowerCase() === 's') {
      this.createCategory();
    }
  }

  async getCategoryDetailsById() {
    let categoryDetails = await this.categoryService.categoryDetailsById(this.categoryId);
    if (categoryDetails.meta.code == 200) {
      categoryDetails.data.order = categoryDetails.data.order.toString()
      this.categoryCreateForm.patchValue(categoryDetails.data);
    }
  }


  defaultForm() {
    this.categoryCreateForm = this.formBuilder.group({
      name: ['', [Validators.required, noWhitespaceValidator]],
      type: ['', [Validators.required, noWhitespaceValidator]],
      order: [0, [Validators.required, noWhitespaceValidator]],
    })
  }

  async createCategory() {
    if (this.categoryCreateForm.invalid) {
      this.invalid = true;
      notification('error', 'Please Fill Category form properly', 1000);
      return
    }

    let object: any = {
      name: this.categoryCreateForm.value.name,
      type: this.categoryCreateForm.value.type,
      order: this.categoryCreateForm.value.order,
    }

    let createUpdateRole = await this.categoryService.categoryCreate(this.categoryId, object);
    if (createUpdateRole.meta.code == 200) {
      notification('success', createUpdateRole.meta.message, 1000);
      this.router.navigateByUrl('admin/task/category');
      this.categoryService.categoryLists = []
    }
  }
}
