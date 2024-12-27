import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchInputComponent } from 'app/CommonComponent/search-input/search-input.component';
import { TableDynamicComponent } from 'app/CommonComponent/table-dynamic/table-dynamic.component';
import { MenusService } from './menus.service';
import { DeleteData, DeleteModalComponent } from '../common-modal/delete-modal/delete-modal.component';
import { notification } from 'assets/notifications.library';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [SearchInputComponent, TableDynamicComponent, RouterLink],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss'
})
export class MenusComponent {

  headerData: any[] = [
    { key: 'srNo', name: 'SR. NO.' },
    { key: 'name', name: 'NAME' },
    { key: 'url', name: 'URL' },
    { key: 'parentMenu', name: 'PARENT MENU' },
    { key: 'status', name: 'STATUS' },
    { key: 'action', name: "ACTION" }
  ]
  allMenusList: any[] = [];
  menuList: any[] = [];

  constructor(public dialog: MatDialog, public menuService: MenusService, public router: Router) { }

  ngOnInit(): void {
    this.getMenuList(false);
  }

  searchFilter(search: any) {
    this.menuList = this.allMenusList.filter((x) => JSON.stringify(x).toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  }

  async getMenuList(force: boolean) {
    let list = await this.menuService.menuList(force);
    if (list.length > 0) {
      this.allMenusList = list.map((x, i) => { return { ...x, srNo: i + 1, action: { edit: true, plus: x.status == 'Inactive' ? true : false, minus: x.status != 'Inactive' ? true : false } } })
      this.menuList = this.allMenusList;
    }
    else {
      this.menuList = [];
      this.allMenusList = [];
    }
  }

  edit(event: any) {
    this.router.navigateByUrl("/admin/auth/menus/update/" + event)
  }

  deleteMenus(id: any) {

    let menuDetails = this.allMenusList.find(x => x._id == id);

    let object: DeleteData = {
      title: `${menuDetails.status == 'Active' ? 'Inactive' : 'Active'} Menu`,
      description: `Are you sure want to ${menuDetails.status == 'Active' ? 'Inactive' : 'Active'} this menus?`,
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
        let deleteMenus: any = await this.menuService.menusDeleteById(id);
        if (deleteMenus.meta.code == 200) {
          notification('success', deleteMenus.meta.message, 1000);
        }
        else {
          notification('error', deleteMenus.meta.message, 1000);
        }
        this.getMenuList(true);
      }
    });
  }


}
