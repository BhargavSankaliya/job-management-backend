import { Component } from '@angular/core';
import { DeleteData, DeleteModalComponent } from '../common-modal/delete-modal/delete-modal.component';
import { notification } from 'assets/notifications.library';
import { MatDialog } from '@angular/material/dialog';
import { ClientMasterService } from './client-master.service';
import { Router, RouterLink } from '@angular/router';
import { SearchInputComponent } from 'app/CommonComponent/search-input/search-input.component';
import { TableDynamicComponent } from 'app/CommonComponent/table-dynamic/table-dynamic.component';
import { setSessionData, StorageKey } from 'app/Providers/http-service/urls.service';

@Component({
  selector: 'app-client-master',
  standalone: true,
  imports: [SearchInputComponent, TableDynamicComponent, RouterLink],
  templateUrl: './client-master.component.html',
  styleUrl: './client-master.component.scss'
})
export class ClientMasterComponent {
  headerData: any[] = [
    { key: 'srNo', name: 'SR. NO.' },
    { key: 'name', name: 'FULL NAME' },
    { key: 'whatsappNumber', name: 'WHATSAPP NUMBER' },
    { key: 'email', name: 'EMAIL' },
    { key: 'phoneNumber', name: 'PHONE' },
    { key: 'status', name: 'STATUS' },
    { key: 'action', name: "ACTION" }
  ]
  allClientList: any[] = [];
  clientLists: any[] = [];

  constructor(public dialog: MatDialog, public clientMasterService: ClientMasterService, public router: Router) { }

  ngOnInit(): void {
    this.getUserList(false);
  }

  searchFilter(search: any) {
    this.clientLists = this.allClientList.filter((x) => JSON.stringify(x).toLocaleLowerCase().includes(search.toLocaleLowerCase()));
    setSessionData(StorageKey.listNumber, String(this.clientLists.length));
  }

  async getUserList(force: boolean) {
    let list = await this.clientMasterService.getClientList(force);
    if (list.length > 0) {
      this.allClientList = list.map((x, i) => { return { ...x, srNo: i + 1, action: { edit: true, plus: x.status == 'Inactive' ? true : false, minus: x.status != 'Inactive' ? true : false }, phoneNumber: x.phoneNumberCountryCode + x.phoneNumber, whatsappNumber: x.whatsappNumberCountryCode + x.whatsappNumber } })
      this.clientLists = this.allClientList;
    }
    else {
      this.clientLists = [];
      this.allClientList = [];
    }

    setSessionData(StorageKey.listNumber, String(this.clientLists.length));


  }

  edit(event: any) {
    this.router.navigateByUrl("/admin/clients/update/" + event)
  }

  deleteRoles(id: any) {

    let clientDetails = this.allClientList.find(x => x._id == id);

    let object: DeleteData = {
      title: `${clientDetails.status == 'Active' ? 'Inactive' : 'Active'} Client`,
      description: `Are you sure want to ${clientDetails.status == 'Active' ? 'Inactive' : 'Active'} this Client?`,
      buttonName: clientDetails.status == 'Active' ? 'Inactive' : 'Active',
    }

    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '600px',
      height: 'auto',
      data: object,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!!result && result.success) {
        let deleteRoles: any = await this.clientMasterService.clientDeleteById(id);
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