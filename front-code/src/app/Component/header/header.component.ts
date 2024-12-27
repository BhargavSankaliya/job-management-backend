import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { getSessionData, removeSessionData, StorageKey } from 'app/Providers/http-service/urls.service';
import { CommonService } from 'app/shared/common.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, NgIf, NgFor, DatePipe, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',

})
export class HeaderComponent implements OnInit {

  authUserData: any;
  storeId: any = '';

  constructor(public router: Router, public commonService: CommonService) { }

  ngOnInit(): void {
    this.authUserData = getSessionData(StorageKey.LOGINDETAILS);
    this.storeId = this.authUserData.id
  }

  addShowClass() {
    debugger
    let id = document.getElementById("add-show-class");
    id?.classList.add("show")
  }

  logout() {
    removeSessionData(StorageKey.LOGINDATA);
    removeSessionData(StorageKey.LOGINDETAILS);
    removeSessionData(StorageKey.TOKEN);
    this.commonService.authCheckIsLogin();
    window.location.reload()
  }
}
