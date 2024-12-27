import { Injectable } from '@angular/core';
import { HttpServiceService } from 'app/Providers/http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public httpService: HttpServiceService) { }

  sidebarLists: any[] = [];

  async getSidebarList(force: boolean = false) {
    if (this.sidebarLists.length == 0 || force) {
      let list = await this.httpService.get('role/side-menuList').toPromise();
      this.sidebarLists = list.data.length > 0 ? list.data : [];
      return this.sidebarLists;
    }
    else {
      return this.sidebarLists;
    }
  }

  async userCreate(id: any, bodyData: any) {
    let userCreates = await this.httpService.post(id ? 'user?id=' + id : 'user', bodyData).toPromise()
    return userCreates;
  }

  userLists: any[] = [];

  async getUserList(force: boolean = false) {
    if (this.userLists.length == 0 || force) {
      let list = await this.httpService.get('user').toPromise();
      this.userLists = list.data.length > 0 ? list.data : [];
      return this.userLists;
    }
    else {
      return this.userLists;
    }
  }

  async userDetailsById(id: string) {
    let userDetails = await this.httpService.get('user/details/' + id).toPromise();
    return userDetails;
  }

  async userDeleteById(id: string) {
    let userDetails = await this.httpService.delete('user/status/' + id).toPromise();
    return userDetails;
  }
}
