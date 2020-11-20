import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';
import { User } from 'src/app/types/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.setPersistence('session');
  }

  async checkUser() {
    return this.afAuth.currentUser;
  }

  async login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.router.navigate(['/login']);
    return this.afAuth.signOut();
  }

  async signUp(email: string, password: string, first: string) {
    const cred = await this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const newUser: User = {
          first,
          email,
          uid: result.user.uid,
        };

        this.setUserData(newUser);
      });
  }
  setUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );
    return userRef.set(user, {
      merge: true,
    });
  }
}
