import { Component } from '@angular/core';
import { RolesService } from './roles.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteData, DeleteModalComponent } from '../common-modal/delete-modal/delete-modal.component';
import { notification } from 'assets/notifications.library';
import { SearchInputComponent } from 'app/CommonComponent/search-input/search-input.component';
import { TableDynamicComponent } from 'app/CommonComponent/table-dynamic/table-dynamic.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [SearchInputComponent, TableDynamicComponent, RouterLink],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {
  headerData: any[] = [
    { key: 'srNo', name: 'SR. NO.' },
    { key: 'name', name: 'NAME' },
    { key: 'status', name: 'STATUS' },
    { key: 'action', name: "ACTION" }
  ]
  allRoleList: any[] = [];
  roleList: any[] = [];

  constructor(public dialog: MatDialog, public roleService: RolesService, public router: Router) { }

  ngOnInit(): void {
    this.getRoleList(false);
  }

  searchFilter(search: any) {
    this.roleList = this.allRoleList.filter((x) => JSON.stringify(x).toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  }

  async getRoleList(force: boolean) {
    let list = await this.roleService.roleList(force);
    if (list.length > 0) {
      this.allRoleList = list.map((x, i) => { return { ...x, srNo: i + 1, action: { edit: true, plus: x.status == 'Inactive' ? true : false, minus: x.status != 'Inactive' ? true : false } } })
      this.roleList = this.allRoleList;
    }
    else {
      this.roleList = [];
      this.allRoleList = [];
    }
  }

  edit(event: any) {
    this.router.navigateByUrl("/admin/auth/roles/update/" + event)
  }

  deleteRoles(id: any) {

    let menuDetails = this.allRoleList.find(x => x._id == id);

    let object: DeleteData = {
      title: `${menuDetails.status == 'Active' ? 'Inactive' : 'Active'} Role`,
      description: `Are you sure want to ${menuDetails.status == 'Active' ? 'Inactive' : 'Active'} this role?`,
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
        let deleteRoles: any = await this.roleService.rolesDeleteById(id);
        if (deleteRoles.meta.code == 200) {
          notification('success', deleteRoles.meta.message, 1000);
        }
        else {
          notification('error', deleteRoles.meta.message, 1000);
        }
        this.getRoleList(true);
      }
    });
  }
}
