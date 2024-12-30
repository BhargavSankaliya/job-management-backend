import { Injectable } from '@angular/core';
import { HttpServiceService } from 'app/Providers/http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(public httpService: HttpServiceService) { }

  taskLists: any[] = [];

  async getTaskList(force: boolean = false, filter: any) {
    if (this.taskLists.length == 0 || force) {
      let list = await this.httpService.post('task/list/all', filter).toPromise();
      this.taskLists = list.data.length > 0 ? list.data : [];
      return this.taskLists;
    }
    else {
      return this.taskLists;
    }
  }

  async taskCreate(id: any, bodyData: any) {
    let taskCreate = await this.httpService.post(id ? 'task?id=' + id : 'task', bodyData).toPromise()
    return taskCreate;
  }
  async getPartyName(search: any, value: any) {
    let partyName = await this.httpService.post(`task/search/${search}`, { search: value }).toPromise()
    return partyName.data;
  }

  async taskDetailsById(id: string) {
    let taskDetails = await this.httpService.get('task/details/' + id).toPromise();
    return taskDetails;
  }

  async taskViewDetailsById(id: string) {
    let taskDetails = await this.httpService.get('task/details-admin/' + id).toPromise();
    return taskDetails.data;
  }

  async taskVieDetailsCommentById(id: string) {
    let taskDetails = await this.httpService.get('task/details-comment/' + id).toPromise();
    return taskDetails.data;
  }

  async taskUserTimeList(id: string) {
    let taskDetails = await this.httpService.get('task/details-user-time/' + id).toPromise();
    return taskDetails.data;
  }

}
