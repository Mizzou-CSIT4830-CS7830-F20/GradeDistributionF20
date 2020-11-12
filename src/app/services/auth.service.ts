import { Injectable } from '@angular/core';
import { User } from 'src/app/types/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { 
  }

  login(email: string, password: string) {
  }

  logout() {
  }

  signUp(email: string, password: string, first: string) {
  }
  setUserData(user: User) {
  }
}
