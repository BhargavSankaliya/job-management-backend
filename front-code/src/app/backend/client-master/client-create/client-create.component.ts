import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextComponent } from 'app/CommonComponent/input-text/input-text.component';
import { noWhitespaceValidator } from 'app/shared/common.service';
import { notification } from 'assets/notifications.library';
import { ClientMasterService } from '../client-master.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextComponent],
  templateUrl: './client-create.component.html',
  styleUrl: './client-create.component.scss'
})
export class ClientCreateComponent implements OnInit, AfterViewInit {

  isEdit: boolean = false;
  clientId: any;
  invalid: boolean = false;
  clientCreateForm: FormGroup;


  constructor(public location: Location, public route: ActivatedRoute, public fb: FormBuilder, public router: Router, public clientMasterService: ClientMasterService) { }

  ngOnInit(): void {
    this.defaultForm();

    let check: any = this.route.snapshot.paramMap.get('clientId');
    if (!!check) {
      this.isEdit = true;
      this.clientId = this.route.snapshot.paramMap.get('clientId');
      this.getClientDetailsById()
    }
  }

  ngAfterViewInit(): void {
    this.clientCreateForm.controls['phoneNumber'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(value => value ? value : null)
    ).subscribe(data => {
      if (data && this.clientCreateForm.value.isSame) {
        this.clientCreateForm.controls['whatsappNumber'].setValue(this.clientCreateForm.value.phoneNumber);
      }
    });
    this.clientCreateForm.controls['phoneNumberCountryCode'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(value => value ? value : null)
    ).subscribe(data => {
      if (data && this.clientCreateForm.value.isSame) {
        this.clientCreateForm.controls['whatsappNumberCountryCode'].setValue(this.clientCreateForm.value.phoneNumberCountryCode);
      }
    });
  }

  async getClientDetailsById() {
    let userDetails = await this.clientMasterService.clientDetailsById(this.clientId);
    if (userDetails.meta.code == 200) {
      this.clientCreateForm.patchValue(userDetails.data);
    }
  }

  defaultForm() {
    this.clientCreateForm = this.fb.group({
      name: ['', [Validators.required, noWhitespaceValidator]],
      email: ['', [Validators.required, noWhitespaceValidator]],
      whatsappNumberCountryCode: ['+91', [Validators.required, noWhitespaceValidator]],
      whatsappNumber: ['', [Validators.required, noWhitespaceValidator]],
      phoneNumberCountryCode: ['+91', [Validators.required, noWhitespaceValidator]],
      phoneNumber: ['', [Validators.required, noWhitespaceValidator]],
      isSame: [true, [Validators.required]],
    })
  }

  async createClient() {
    if (this.clientCreateForm.invalid) {
      this.invalid = true;
      return;
    }

    let object = {
      name: this.clientCreateForm.value.name,
      email: this.clientCreateForm.value.email,
      whatsappNumberCountryCode: this.clientCreateForm.value.whatsappNumberCountryCode,
      whatsappNumber: this.clientCreateForm.value.whatsappNumber,
      phoneNumberCountryCode: this.clientCreateForm.value.phoneNumberCountryCode,
      phoneNumber: this.clientCreateForm.value.phoneNumber,
    }

    let createUpdateUser = await this.clientMasterService.createClient(this.clientId, object);
    if (createUpdateUser.meta.code == 200) {
      notification('success', createUpdateUser.meta.message, 1000);
      this.router.navigateByUrl('admin/clients');
      this.clientMasterService.userLists = []
    }

  }

}
