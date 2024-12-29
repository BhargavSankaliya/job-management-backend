import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SearchInputComponent } from 'app/CommonComponent/search-input/search-input.component';
import { TableDynamicComponent } from 'app/CommonComponent/table-dynamic/table-dynamic.component';
import { DeleteData, DeleteModalComponent } from '../common-modal/delete-modal/delete-modal.component';
import { notification } from 'assets/notifications.library';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from './task.service';
import moment from 'moment'

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [RouterLink, TableDynamicComponent, SearchInputComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  headerData: any[] = [
    { key: 'jobNo', name: 'JOB NO.' },
    { key: 'counter', name: 'ESTIMATED COUNTER' },
    { key: 'partyName', name: 'PARTY NAME' },
    { key: 'jobName', name: 'JOB NAME' },
    { key: 'size', name: 'SIZE' },
    { key: 'operator', name: 'OPERATOR' },
    { key: 'date', name: 'DATE' },
    { key: 'taskStatus', name: 'TASK STATUS' },
    { key: 'action', name: "ACTION" }
  ]
  allUserList: any[] = [];
  userList: any[] = [];

  constructor(public dialog: MatDialog, public taskService: TaskService, public router: Router) { }

  ngOnInit(): void {
    this.getUserList(false);
  }

  searchFilter(search: any) {
    this.userList = this.allUserList.filter((x) => JSON.stringify(x).toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  }

  async getUserList(force: boolean) {
    let list = await this.taskService.getTaskList(force);
    if (list.length > 0) {
      this.allUserList = list.map((x, i) => { return { ...x, date: moment(x.createdAt).format("DD/MM/yyyy"), srNo: i + 1, action: { edit: true, view: true } } })
      this.userList = this.allUserList;
    }
    else {
      this.userList = [];
      this.allUserList = [];
    }
  }

  edit(event: any) {
    this.router.navigateByUrl("/admin/task/list/update/" + event)
  }
  view(event: any) {
    this.router.navigateByUrl("/admin/task/list/view/" + event)
  }

}
