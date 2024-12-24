import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];
