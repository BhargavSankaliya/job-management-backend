import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { SearchInputComponent } from 'app/CommonComponent/search-input/search-input.component';
import { TableDynamicComponent } from 'app/CommonComponent/table-dynamic/table-dynamic.component';
import { CategoryService } from './category.service';
import { DeleteData, DeleteModalComponent } from 'app/backend/common-modal/delete-modal/delete-modal.component';
import { notification } from 'assets/notifications.library';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [TableDynamicComponent, SearchInputComponent, RouterLink],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  headerData: any[] = [
    { key: 'srNo', name: 'SR. NO.' },
    { key: 'name', name: 'NAME' },
    { key: 'status', name: 'STATUS' },
    { key: 'action', name: "ACTION" }
  ]
  allCategoryList: any[] = [];
  categoryList: any[] = [];

  constructor(public dialog: MatDialog, public categoryService: CategoryService, public router: Router) { }

  ngOnInit(): void {
    this.getCategoryList(false);
  }

  searchFilter(search: any) {
    this.categoryList = this.allCategoryList.filter((x) => JSON.stringify(x).toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  }

  async getCategoryList(force: boolean) {
    let list = await this.categoryService.categoryList(force);
    if (list.length > 0) {
      this.allCategoryList = list.map((x, i) => { return { ...x, srNo: i + 1, action: { edit: true, plus: x.status == 'Inactive' ? true : false, minus: x.status != 'Inactive' ? true : false } } })
      this.categoryList = this.allCategoryList;
    }
    else {
      this.categoryList = [];
      this.allCategoryList = [];
    }
  }

  edit(event: any) {
    this.router.navigateByUrl("/admin/task/category/update/" + event)
  }

  deleteRoles(id: any) {

    let menuDetails = this.allCategoryList.find(x => x._id == id);

    let object: DeleteData = {
      title: `${menuDetails.status == 'Active' ? 'Inactive' : 'Active'} Category`,
      description: `Are you sure want to ${menuDetails.status == 'Active' ? 'Inactive' : 'Active'} this Category?`,
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
        let deleteRoles: any = await this.categoryService.categoryDeleteById(id);
        if (deleteRoles.meta.code == 200) {
          notification('success', deleteRoles.meta.message, 1000);
        }
        else {
          notification('error', deleteRoles.meta.message, 1000);
        }
        this.getCategoryList(true);
      }
    });
  }
}
