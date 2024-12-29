import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { BackendComponent } from './backend/backend.component';
import { DashboardComponent } from './backend/dashboard/dashboard.component';
import { MenusComponent } from './backend/menus/menus.component';
import { RolesComponent } from './backend/roles/roles.component';
import { UsersComponent } from './backend/users/users.component';
import { MenuCreateComponent } from './backend/menus/menu-create/menu-create.component';
import { RoleCreateComponent } from './backend/roles/role-create/role-create.component';
import { UserCreateComponent } from './backend/users/user-create/user-create.component';
import { TaskComponent } from './backend/task/task.component';
import { TaskCreateComponent } from './backend/task/task-create/task-create.component';
import { TaskViewComponent } from './backend/task/task-view/task-view.component';
import { CategoryComponent } from './backend/task/category/category.component';
import { CategoryCreateComponent } from './backend/task/category/category-create/category-create.component';
import { ProfileComponent } from './backend/profile/profile.component';

export const routes: Routes = [
    // auth url
    { path: '', component: AuthenticationComponent },

    // after authentication setup POS Cachier Module
    {
        path: 'admin',
        component: BackendComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'profile/:userId', component: UserCreateComponent },

            { path: 'auth/menus', component: MenusComponent },
            { path: 'auth/menus/create', component: MenuCreateComponent },
            { path: 'auth/menus/update/:menuId', component: MenuCreateComponent },

            { path: 'auth/roles', component: RolesComponent },
            { path: 'auth/roles/create', component: RoleCreateComponent },
            { path: 'auth/roles/update/:roleId', component: RoleCreateComponent },

            { path: 'users', component: UsersComponent },
            { path: 'users/create', component: UserCreateComponent },
            { path: 'users/update/:userId', component: UserCreateComponent },

            { path: 'task/list', component: TaskComponent },
            { path: 'task/list/create', component: TaskCreateComponent },
            { path: 'task/list/update/:taskId', component: TaskCreateComponent },
            { path: 'task/list/view/:taskId', component: TaskViewComponent },

            { path: 'task/category', component: CategoryComponent },
            { path: 'task/category/create', component: CategoryCreateComponent },
            { path: 'task/category/update/:categoryId', component: CategoryCreateComponent },
        ],
    },
];
