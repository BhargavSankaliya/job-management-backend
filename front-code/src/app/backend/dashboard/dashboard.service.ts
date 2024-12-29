import { Injectable } from '@angular/core';
import { HttpServiceService } from 'app/Providers/http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(public httpService: HttpServiceService) { }

  async getCountForTask(data: any) {
    debugger
    let count: any = await this.httpService.post("task/dashboard-task-count", data).toPromise();
    return count.data
  }

  async getUserDetails() {
    let response: any = await this.httpService.get("user/details-fAdmin").toPromise();
    return response.data
  }

}
