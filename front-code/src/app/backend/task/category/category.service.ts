import { Injectable } from '@angular/core';
import { HttpServiceService } from 'app/Providers/http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(public httpService: HttpServiceService) { }

  async categoryCreate(id: any, bodyData: any) {
    let categoryCreate = await this.httpService.post(id ? 'task-category?id=' + id : 'task-category', bodyData).toPromise()
    return categoryCreate;
  }

  categoryLists: any[] = [];
  activecategoryLists: any[] = [];

  async categoryList(force: boolean = false) {
    if (this.categoryLists.length == 0 || force) {
      let list = await this.httpService.get('task-category').toPromise();
      this.categoryLists = list.data.length > 0 ? list.data : [];
      return this.categoryLists;
    }
    else {
      return this.categoryLists;
    }
  }

  async activeCategoryList(force: boolean = false) {
    if (this.activecategoryLists.length == 0 || force) {
      let list = await this.httpService.get('task-category?status=Active').toPromise();
      this.activecategoryLists = list.data.length > 0 ? list.data : [];
      return this.activecategoryLists;
    }
    else {
      return this.activecategoryLists;
    }
  }

  async categoryDetailsById(id: string) {
    let categoryDetails = await this.httpService.get('task-category/details/' + id).toPromise();
    return categoryDetails;
  }

  async categoryDeleteById(id: string) {
    let categoryDetails = await this.httpService.delete('task-category/status/' + id).toPromise();
    return categoryDetails;
  }
}
