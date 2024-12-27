import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { CoreHelperService } from '../../Providers/core-helper/core-helper.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonService } from 'app/shared/common.service';
import { getSessionData, StorageKey } from 'app/Providers/http-service/urls.service';
import { HttpServiceService } from 'app/Providers/http-service/http-service.service';
import { AuthenicationService } from 'app/authentication/authenication.service';
import { UserService } from 'app/backend/users/user.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, MatTooltipModule, NgClass, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, AfterViewInit {

  authUserData: any[] = [];
  constructor(public router: Router, public commonService: CommonService, public userService: UserService, public authenicationService: AuthenicationService, public httpService: HttpServiceService) {
    this.getRole()


  }

  async getRole() {
    this.authUserData = [];
    let sideMenuList: any[] = await this.userService.getSidebarList();
    sideMenuList.map((x) => {
      x.childData = []
    })

    sideMenuList.map((x) => {

      let findMenu = this.authUserData.findIndex((y) => y.name == x.parentMenu && !!x.parentMenu)
      if (findMenu != -1) {
        this.authUserData[findMenu].childData.push(x)
      }
      else {
        this.authUserData.push(x)
      }
    })


    console.log(this.authUserData);


  }

  ngOnInit(): void {
    // Load scripts in ngOnInit after ensuring dependencies are met
    this.loadScripts();
  }
  ngAfterViewInit(): void {
    // Load scripts after the view has been initialized
    this.commonService.loadJqueryScripts();
    this.commonService.loadPopperScripts();
    this.commonService.loadPerfectScrollbarScripts();
    this.commonService.loadMenuScripts();
    this.commonService.loadMainScripts();
  }

  private loadScripts(): void {
    this.commonService.loadJqueryScripts();
    this.commonService.loadPopperScripts();
    this.commonService.loadPerfectScrollbarScripts();
    this.commonService.loadMenuScripts();
    this.commonService.loadMainScripts();
  }



}
