import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';
import { User } from 'src/app/types/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) { 
    this.afAuth.setPersistence('session');
    // this.currentAuth = this.afAuth.authState;
    // this.currentUser = this.afAuth

    // this.currentUser = this.currentAuth.pipe(
    //   switchMap((cred: firebase.User | null) => {
    //     if (cred) {
    //       return this.afs.doc<User>(`users/${cred.uid}`).valueChanges();
    //     } else {
    //       return of(undefined);
    //     }
    //   }),
    //   map(userDetails => userDetails as User)
    // );
  }

  async login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
    // return this.afAuth.signInWithEmailAndPassword(email, password).then((result) => {
    //   return true; 
    // }).catch((e) => {
    //   return false; 
    // });
  }

  logout() {
    return this.afAuth.signOut();
    // this.router.navigate(['/login']);
  }

  async signUp(email: string, password: string, first: string) {
    // try {
      const cred = await this.afAuth.createUserWithEmailAndPassword(email, password).then(result => {
        const newUser: User = {
          first,
          email,
          uid: result.user.uid
        };

        this.setUserData(newUser);
      });
      
    //   this.afs.doc<User>(`users/${cred.user.uid}`).set(newUser);
    // } catch (err) {
    //   throw new Error('Could not create account');
    // }
  }
  setUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
			`users/${user.uid}`
		);
		return userRef.set(user, {
			merge: true
		});
  }
}
