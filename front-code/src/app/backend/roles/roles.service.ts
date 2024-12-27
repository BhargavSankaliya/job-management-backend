import { Injectable } from '@angular/core';
import { HttpServiceService } from 'app/Providers/http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(public httpService: HttpServiceService) { }

  async roleCreate(id: any, bodyData: any) {
    let roleCreates = await this.httpService.post(id ? 'role?id=' + id : 'role', bodyData).toPromise()
    return roleCreates;
  }

  roleLists: any[] = [];

  async roleList(force: boolean = false) {
    if (this.roleLists.length == 0 || force) {
      let list = await this.httpService.get('role').toPromise();
      this.roleLists = list.data.length > 0 ? list.data : [];
      return this.roleLists;
    }
    else {
      return this.roleLists;
    }
  }

  async roleDetailsById(id: string) {
    let menuDetails = await this.httpService.get('role/details/' + id).toPromise();
    return menuDetails;
  }

  async rolesDeleteById(id: string) {
    let menuDetails = await this.httpService.delete('role/status/' + id).toPromise();
    return menuDetails;
  }
}
