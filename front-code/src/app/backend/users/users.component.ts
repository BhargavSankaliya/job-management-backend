import { Component } from '@angular/core';
import { SearchInputComponent } from 'app/CommonComponent/search-input/search-input.component';
import { TableDynamicComponent } from 'app/CommonComponent/table-dynamic/table-dynamic.component';
import { UserService } from './user.service';
import { Router, RouterLink } from '@angular/router';
import { DeleteData, DeleteModalComponent } from '../common-modal/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { notification } from 'assets/notifications.library';
import { setSessionData, StorageKey } from 'app/Providers/http-service/urls.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SearchInputComponent, TableDynamicComponent, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  headerData: any[] = [
    { key: 'srNo', name: 'SR. NO.' },
    { key: 'firstName', name: 'FIRST NAME' },
    { key: 'lastName', name: 'LAST NAME' },
    { key: 'email', name: 'EMAIL' },
    { key: 'phone', name: 'PHONE' },
    { key: 'status', name: 'STATUS' },
    { key: 'action', name: "ACTION" }
  ]
  allUserList: any[] = [];
  userList: any[] = [];

  constructor(public dialog: MatDialog, public userService: UserService, public router: Router) { }

  ngOnInit(): void {
    this.getUserList(false);
  }

  searchFilter(search: any) {
    this.userList = this.allUserList.filter((x) => JSON.stringify(x).toLocaleLowerCase().includes(search.toLocaleLowerCase()));
    setSessionData(StorageKey.listNumber, String(this.userList.length));
  }

  async getUserList(force: boolean) {
    let list = await this.userService.getUserList(force);
    if (list.length > 0) {
      this.allUserList = list.map((x, i) => { return { ...x, srNo: i + 1, action: { edit: true, plus: x.status == 'Inactive' ? true : false, minus: x.status != 'Inactive' ? true : false } } })
      this.userList = this.allUserList;
    }
    else {
      this.userList = [];
      this.allUserList = [];
    }

    setSessionData(StorageKey.listNumber, String(this.userList.length));
  }

  edit(event: any) {
    this.router.navigateByUrl("/admin/users/update/" + event)
  }

  deleteRoles(id: any) {

    let menuDetails = this.allUserList.find(x => x._id == id);

    let object: DeleteData = {
      title: `${menuDetails.status == 'Active' ? 'Inactive' : 'Active'} User`,
      description: `Are you sure want to ${menuDetails.status == 'Active' ? 'Inactive' : 'Active'} this User?`,
      buttonName: menuDetails.status == 'Active' ? 'Inactive' : 'Active',
    }

    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '600px',
      height: 'auto',
      data: object,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!!result && result.success) {
        let deleteRoles: any = await this.userService.userDeleteById(id);
        if (deleteRoles.meta.code == 200) {
          notification('success', deleteRoles.meta.message, 1000);
        }
        else {
          notification('error', deleteRoles.meta.message, 1000);
        }
        this.getUserList(true);
      }
    });
  }
}
