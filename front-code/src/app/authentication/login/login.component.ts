import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextComponent } from 'app/CommonComponent/input-text/input-text.component';
import { setSessionData, StorageKey } from 'app/Providers/http-service/urls.service';
import { notification } from 'assets/notifications.library';
import { AuthenicationService } from '../authenication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputTextComponent, ReactiveFormsModule, NgIf, NgClass, NgFor],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  @Output() isLoginFlag = new EventEmitter<any>();
  @Output() isSendOTPFlag = new EventEmitter<any>();

  constructor(public formBuilder: FormBuilder, public authenicationService: AuthenicationService) { }

  ngOnInit(): void {
    this.defaultForm();
  }

  defaultForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  async login() {
    if (this.loginForm.invalid) {
      notification('error', 'Please enter credential', 1000);
      return
    }

    let object = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }

    let loginAccess = await this.authenicationService.login(object);
    if (loginAccess.meta.code == 200) {
      // login api calling 
      notification('success', 'Login Successfully', 1000)
      this.defaultForm();
      setSessionData(StorageKey.LOGINDATA, 'true');
      setSessionData(StorageKey.LOGINDETAILS, JSON.stringify(loginAccess.data));
      setSessionData(StorageKey.TOKEN, JSON.stringify(loginAccess.data.token));
      this.isLoginFlag.emit()
    }
    else {
      notification('error', loginAccess.meta.message, 1000)
    }



  }

  forgotPassword() {
    this.defaultForm();
    this.isSendOTPFlag.emit();
  }

}
