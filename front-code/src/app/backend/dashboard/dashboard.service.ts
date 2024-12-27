import { Injectable } from '@angular/core';
import { HttpServiceService } from 'app/Providers/http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(public httpService: HttpServiceService) { }

  async getCountForTask(data: { startDate: any, endDate: any, userId: any }) {
    let count: any = await this.httpService.post("task/dashboard-task-count", data).toPromise();
    return count.data
  }

}
