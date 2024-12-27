import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextComponent } from 'app/CommonComponent/input-text/input-text.component';
import { LoginComponent } from './login/login.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/common.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [InputTextComponent, FormsModule, ReactiveFormsModule, LoginComponent, NgIf, NgClass, NgFor],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {

  storeId: any = '';
  isLoginFlag: boolean = true;
  isSendOTPFlag: boolean = false;
  isOTPVerifyFlag: boolean = false;
  isNewPassword: boolean = false;

  constructor(public router: Router, public commonService: CommonService) {
    commonService.authCheck();
  }

  loginPage() {
    this.isLoginFlag = true;
    this.isSendOTPFlag = false;
    this.isOTPVerifyFlag = false;
    this.isNewPassword = false;
  }
  otpSend() {
    this.isLoginFlag = false;
    this.isSendOTPFlag = true;
    this.isOTPVerifyFlag = false;
    this.isNewPassword = false;
  }
  otpVerificationPage(storeId: any) {
    this.storeId = storeId;
    this.isLoginFlag = false;
    this.isSendOTPFlag = false;
    this.isOTPVerifyFlag = true;
    this.isNewPassword = false;
  }
  forgotPasswordPage() {
    this.isLoginFlag = false;
    this.isSendOTPFlag = false;
    this.isOTPVerifyFlag = false;
    this.isNewPassword = true;
  }

  login() {
    this.router.navigateByUrl('/admin/dashboard')
  }

}
