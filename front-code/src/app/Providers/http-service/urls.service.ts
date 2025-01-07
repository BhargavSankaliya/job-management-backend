import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {

  constructor() { }





  // auth url 
  getRestaurantNames() { return 'restaurants/names' } // get all restaurant name
  getRestaurantWiseEmployeeName(restaurantId: string) { return `restaurants/${restaurantId}/employees` } // get all employee name restaurant wise
  employeeLogin() { return 'employees/login' } // for employee login 

  getRestaurantDetails(restaurantId: string) { return `Restaurants/${restaurantId}` } // for restaurant Details

  getAllRestaurantItems(restaurantId: string) { return `restaurants/${restaurantId}/item` }; // get all items of restaurant wise

  getAllUsers() { return 'users' };
  getAddress() { return 'users/address' };
  couponApi() { return 'coupons' };
  createRestaurantOrder() { return 'RestaurantOrders' };

}

export function setSessionData(key: StorageKey, value: string) {
  localStorage.setItem(key, value);
}

export function getSessionData(key: StorageKey) {
  let data: any = localStorage.getItem(key);
  return JSON.parse(data);
}

export function removeSessionData(key: StorageKey) {
  localStorage.removeItem(key);
}

export enum StorageKey {
  LOGINDATA = 'LOGINDATA',
  LOGINDETAILS = 'LOGINDETAILS',
  TOKEN = 'TOKEN',
  STARTDATE = 'STARTDATE',
  ENDDATE = 'ENDDATE'
}