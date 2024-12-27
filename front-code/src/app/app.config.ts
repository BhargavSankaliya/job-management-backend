import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoaderService } from './Providers/core-interceptor/loader.service';
import { InterceptorService } from './Providers/core-interceptor/core-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    // provideClientHydration(),
    provideNoopAnimations(),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true
    },
  ]
};
