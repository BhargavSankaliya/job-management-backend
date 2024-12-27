import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from './../../environments/environment';
import { FormControl } from '@angular/forms';
import { getSessionData, removeSessionData, StorageKey } from 'app/Providers/http-service/urls.service';
import { Router } from '@angular/router';
import { City, Country, State } from 'country-state-city';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  rootData: any = {};
  constructor(private http: HttpClient, public router: Router) {
    this.rootData.rootUrl = environment.apiUrl + "api/";
    this.rootData.guestUrl = environment.apiUrl + "guest/";
  }

  authCheckIsLogin() {
    let data = getSessionData(StorageKey.LOGINDETAILS);
    if (!data) {
      this.router.navigateByUrl('/')
    }
  }

  logout() {
    removeSessionData(StorageKey.LOGINDATA);
    removeSessionData(StorageKey.LOGINDETAILS);
    removeSessionData(StorageKey.TOKEN);
    this.authCheckIsLogin();
    window.location.reload()
  }

  authCheck() {
    let data = getSessionData(StorageKey.LOGINDETAILS);
    if (!!data) {
      this.router.navigateByUrl('/admin/dashboard')
    }
  }


  loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!document.querySelector(`script[src="${url}"]`)) {
        const scriptElement = document.createElement('script');
        scriptElement.src = url;
        scriptElement.type = 'text/javascript';
        scriptElement.onload = () => resolve();
        scriptElement.onerror = () => reject(`Error loading script: ${url}`);
        document.body.appendChild(scriptElement);
      } else {
        resolve(); // Script already loaded
      }
    });
  }

  loadJSScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!document.querySelector(`script[src="${url}"]`)) {
        window.location.reload();
      } else {
        resolve(); // Script already loaded
      }
    });
  }

  loadJqueryScripts(): Promise<void> {
    return this.loadScript('../../assets/vendor/libs/jquery/jquery.js');
  }

  loadPopperScripts(): Promise<void> {
    return this.loadScript('../../assets/vendor/libs/popper/popper.js');
  }

  loadPerfectScrollbarScripts(): Promise<void> {
    return this.loadScript('../../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js');
  }
  loadBootstrapScripts(): Promise<void> {
    return this.loadScript('../../assets/vendor/js/bootstrap');
  }
  loadUIModalScripts(): Promise<void> {
    return this.loadScript('../../assets/js/ui-modals.js');
  }

  loadMenuScripts(): Promise<void> {
    return this.loadScript('../../assets/vendor/js/menu.js');
  }

  loadMainScripts(): Promise<void> {
    return this.loadScript('../../assets/js/main.js');
  }

  getCountryName(countryCode: any) {
    return Country.getCountryByCode(countryCode)?.name;
  }

  getStateName(countryCode: any, stateCode: any) {
    return State.getStateByCodeAndCountry(stateCode, countryCode)?.name;
  }

  getCityName(countryCode: any, stateCode: any, cityname: string) {
    let getCities = City.getCitiesOfState(countryCode, stateCode);
    return getCities.find((x) => x.name == cityname)?.name;
  }
}


export function noWhitespaceValidator(control: FormControl) {
  return (control.value || '').trim().length ? null : { 'whitespace': true };
}

export const angularEditorConfigData = {
  editable: true,
  spellcheck: true,
  height: '10rem',
  minHeight: '10rem',
  placeholder: 'Enter text here...',
  translate: 'no',
  sanitize: true,
  toolbarHiddenButtons: [
    [
      'strikeThrough',
      'subscript',
      'superscript',
      'indent',
      'outdent',
      'heading',
      'fontName'
    ],
    [
      'customClasses',
      'link',
      'unlink',
      'insertImage',
      'insertVideo',
      'insertHorizontalRule',
      'removeFormat',
      'backgroundColor',
      'toggleEditorMode'
    ]
  ]
  // customClasses: [
  //     {
  //         name: "quote",
  //         class: "quote",
  //     },
  //     {
  //         name: 'redText',
  //         class: 'redText'
  //     },
  //     {
  //         name: "titleText",
  //         class: "titleText",
  //         tag: "h1",
  //     },
  // ]
};