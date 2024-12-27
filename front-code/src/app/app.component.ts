import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './Providers/core-interceptor/loader.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './Providers/core-interceptor/core-interceptor.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonService } from './shared/common.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxSpinnerModule,
  ],
  providers: [LoaderService,
    {
      provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'jewellery-pos';

  constructor(public commonService:CommonService) {
    // commonService.loadJqueryScripts();
    // commonService.loadPopperScripts();
    // commonService.loadPerfectScrollbarScripts();
    // commonService.loadMenuScripts();
    // commonService.loadMainScripts();
  }

}
