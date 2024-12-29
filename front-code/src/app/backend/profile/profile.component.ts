import { Location, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgClass, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  userDetails: ProfileInterface

  constructor(public route: ActivatedRoute, public location: Location, public dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.getTaskDetailsById();
  }

  async getTaskDetailsById() {
    let details: any = await this.dashboardService.getUserDetails();
    this.userDetails = details
  }
}


export interface ProfileInterface {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  isVerified: boolean
  gender: string
  address: string
  profilePicture: string
  status: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
  __v: number
  roleId: string
  token: string
  roleDetails: RoleDetails
}

export interface RoleDetails {
  _id: string
  name: string
  permission: Permission[]
  status: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
  __v: number
}

export interface Permission {
  menuId: string
  isShow: boolean
  _id: string
}
