import { Injectable } from '@angular/core';
import { HttpServiceService } from 'app/Providers/http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  constructor(public httpService: HttpServiceService) { }

  async menuCreate(id: any, bodyData: any) {
    let menuCreates = await this.httpService.post(id ? 'menu?id=' + id : 'menu', bodyData).toPromise()
    return menuCreates;
  }

  menuLists: any[] = [];

  async menuList(force: boolean = false) {
    if (this.menuLists.length == 0 || force) {
      let list = await this.httpService.get('menu').toPromise();
      this.menuLists = list.data.length > 0 ? list.data : [];
      return this.menuLists;
    }
    else {
      return this.menuLists;
    }
  }

  async menuDetailsById(id: string) {
    let menuDetails = await this.httpService.get('menu/' + id).toPromise();
    return menuDetails;
  }

  async menusDeleteById(id: string) {
    let menuDetails = await this.httpService.delete('menu/status/' + id).toPromise();
    return menuDetails;
  }
}
