import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { Custom404Component } from './pages/custom404/custom404.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DetailsComponent } from './pages/details/details.component';
import { ClassDetailsComponent } from './pages/class-details/class-details.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
    // canActivate: [AuthGuardService],
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    // canActivate: [AuthGuardService],
  },
  {
    path: 'classDetails/:professorId/:classId',
    component: ClassDetailsComponent,
    // canActivate: [AuthGuardService],
  },
  {
    path: '**',
    component: Custom404Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
