import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));



// https://korbiniankuhn.medium.com/how-to-avoid-the-angular-white-screen-of-death-a11e31d13633