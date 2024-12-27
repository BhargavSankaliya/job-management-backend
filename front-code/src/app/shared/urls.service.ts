import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {

  constructor() { }

  // category url
  categoryCreate: string = '';
  categoryList: string = '';
  categoryActiveDeactive: string = '';
}
