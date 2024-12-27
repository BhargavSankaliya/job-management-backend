import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenicationService } from 'app/authentication/authenication.service';
import { HeaderComponent } from 'app/Component/header/header.component';
import { SidebarComponent } from 'app/Component/sidebar/sidebar.component';
import { CommonService } from 'app/shared/common.service';

@Component({
  selector: 'app-backend',
  standalone: true,
  imports: [RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './backend.component.html',
  styleUrl: './backend.component.scss'
})
export class BackendComponent implements OnInit, OnChanges, AfterViewInit {

  intervalData: any;


  constructor(public commonService: CommonService, public authenicationService: AuthenicationService) {

    commonService.authCheckIsLogin();
    // authenicationService.getRole()

    // let primaryBackgroundColor = "#FE6847"
    // let primaryBorderColor = "#FE6847"
    // let primaryBackgroundTextColor = "#ffffff"
    // let primaryTextColor = "#FE6847"
    // document.documentElement.style.setProperty('--primary-background-color', primaryBackgroundColor);
    // document.documentElement.style.setProperty('--primary-border-color', primaryBorderColor);
    // document.documentElement.style.setProperty('--primary-background-text-color', primaryBackgroundTextColor);
    // document.documentElement.style.setProperty('--primary-background-shadow-color', primaryBackgroundColor + '66');
    // document.documentElement.style.setProperty('--primary-background-transparent-color', primaryBackgroundColor + '29');
    // document.documentElement.style.setProperty('--primary-text-color', primaryTextColor);


  }

  ngOnInit(): void {
    // Load scripts in ngOnInit after ensuring dependencies are met
    this.loadScripts();
  }

  private loadScripts(): void {
    this.commonService.loadJqueryScripts();
    this.commonService.loadPopperScripts();
    // this.commonService.loadBootstrapScripts();
    // this.commonService.loadPerfectScrollbarScripts();
    this.commonService.loadMenuScripts();
    this.commonService.loadMainScripts();
  }


  async ngAfterViewInit(): Promise<void> {
    try {
      // await this.commonService.loadJSScript("../../assets/vendor/libs/jquery/jquery.js");
      await this.commonService.loadJqueryScripts();
      await this.commonService.loadPopperScripts();
      // await this.commonService.loadPerfectScrollbarScripts();
      await this.commonService.loadMenuScripts();
      await this.commonService.loadMainScripts();
      console.log('All scripts loaded successfully');
    } catch (error) {
      console.error('Error loading scripts', error);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

  }
}
