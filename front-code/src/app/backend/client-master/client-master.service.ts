import { Injectable } from '@angular/core';
import { HttpServiceService } from 'app/Providers/http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class ClientMasterService {

  constructor(public httpService: HttpServiceService) { }

  userLists: any[] = [];

  async getClientList(force: boolean = false) {
    if (this.userLists.length == 0 || force) {
      let list = await this.httpService.get('client').toPromise();
      this.userLists = list.data.length > 0 ? list.data : [];
      return this.userLists;
    }
    else {
      return this.userLists;
    }
  }

  async createClient(id: any, bodyData: any) {
    let userCreates = await this.httpService.post(id ? 'client?id=' + id : 'client', bodyData).toPromise()
    return userCreates;
  }

  async getClientActiveList() {
    let userActiveList = await this.httpService.get('client?status=Active').toPromise()
    return userActiveList.data;
  }

  async clientDetailsById(id: string) {
    let clientDetails = await this.httpService.get('client/details/' + id).toPromise();
    return clientDetails;
  }


  async clientDeleteById(id: string) {
    let clientDetails = await this.httpService.delete('client/status/' + id).toPromise();
    return clientDetails;
  }

}
