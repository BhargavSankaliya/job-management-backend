import { Injectable } from '@angular/core';
import { HttpServiceService } from 'app/Providers/http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenicationService {

  constructor(private httpService: HttpServiceService) { }

  async login(body: any) {
    let loginAccess = await this.httpService.post("user/login", body).toPromise();
    return loginAccess;
  }

  async sendOtp(body: any) {
    let otpSend = await this.httpService.post("auth/forgot-password", body).toPromise();
    return otpSend;
  }

  async verifyOtp(body: any) {
    let otpVerify = await this.httpService.post("auth/otpVerify-UpdatePassword", body).toPromise();
    return otpVerify;
  }

  async resetPassword(body: any) {
    let resetPassword = await this.httpService.post("auth/reset-password", body).toPromise();
    return resetPassword;
  }

  authUserRole: any = '';

  async getRole() {
    let response = await this.httpService.get('auth/role').toPromise();
    this.authUserRole = response.data;
    return response.data
  }

}
