import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Professor } from 'src/app/types/professor';
import { ClassData } from 'src/app/types/class-data';
import { AddProfessorDataResponse } from 'src/app/types/add-professor-data-response';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  professorCollection: AngularFirestoreCollection<Professor>;
  professors: Observable<Professor[]>;

  constructor(
    private db: AngularFirestore,
    private http: HttpClient,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.currentUser.then((user) => {
      // this.userID = user.uid;

      this.professorCollection = this.db.collection<Professor>(
        'professors',
        (ref) => ref.where('trackedBy', 'array-contains', user.uid)
      );
      this.professors = this.professorCollection.valueChanges();

      this.professors.forEach((professor) => {
        console.log(professor);
      });
    });
  }

  getProfessors(userID): Observable<Professor[]> {
    // if (this.userID) {
    // }
    // this.userID = await this.getCurrentUserUID();
    return this.db
      .collection<Professor>('professors', (ref) =>
        ref.where('trackedBy', 'array-contains', userID)
      )
      .valueChanges();
    // .pipe(
    //   map((professors) => {
    //     professors.sort((profA, profB) => {
    //       return profA.name > profB.name ? 1 : -1;
    //     });
    //   })
    // );
    // .collection<Professor>('professors', (ref) =>
    //   ref.where('trackedBy', 'array-contains', user.uid)
    // )
    // .valueChanges()
    // .pipe(
    //   map((professors) => {
    //     console.log('professors: ' + professors);
    //     professors.sort((profA, profB) => {
    //       return profA.name > profB.name ? 1 : -1;
    //     });
    //   })
    // );

    // const currentUser = this.afAuth.currentUser;
    // this.afAuth.currentUser.then((user) => {
    // this.afAuth.currentUser.then((user) => {
    //   this.userID = user.uid;
    //   console.log('user id in .then(): ' + user.uid);
    //   return this.db
    //     .collection<Professor>('professors', (ref) =>
    //       ref.where('trackedBy', 'array-contains', this.userID)
    //     )
    //     .valueChanges();
    // });
    // console.log('current user ID: ' + this.userID);
    // });
    // return new Promise((resolve, reject) => {
    //   this.afAuth.currentUser.then((user) => {
    //     this.userID = user.uid;
    //     console.log('user: ' + user);
    //     if (user) {
    //       console.log('user id: ' + user.uid);
    //       resolve(this.db
    //         .collection<Professor>('professors', (ref) =>
    //           ref.where('trackedBy', 'array-contains', user.uid)
    //         )
    //         .valueChanges()
    //         .pipe(
    //           map((professors) => {
    //             console.log('professors: ' + professors);
    //             professors.sort((profA, profB) => {
    //               return profA.name > profB.name ? 1 : -1;
    //             });
    //           })
    //         );
    //       );
    //       // console.log('right before return');
    //       // return this.db.collection<Professor>('professors').valueChanges();
    //     } else {
    //     console.log('User not logged in ');
    //     rejects([]);
    //       // return of([]);
    //     }
    //   });
    // });
    // .catch((err) => {
    //   return of([]);
    // })
    // .finally(() => {
    //   return of([]);
    // });
    // this shouldn't happen, but just in case this will keep us from crashing
    // return of([]);
    // return this.db
    //   .collection<Professor>('professors', (ref) =>
    //     ref.where('trackedBy', 'array-contains', this.userID)
    //   )
    //   .valueChanges();
  }

  async getCurrentUserUID() {
    return (await this.afAuth.currentUser).uid;
  }

  getClasses(professorId: string): Observable<ClassData[]> {
    return this.db
      .collection('professors')
      .doc(professorId)
      .collection<ClassData>('classes')
      .valueChanges();
  }

  getProfessorDetails(professorId: string): Observable<Professor> {
    return this.db
      .collection('professors')
      .doc<Professor>(professorId)
      .valueChanges();
  }

  addProfessorData(professorName: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const url =
        'https://us-central1-gradedistributionappf20.cloudfunctions.net/GetProfessorDataF20';

      this.afAuth.currentUser.then((user) => {
        if (user) {
          const data = {
            prof: professorName,
            user_id: user.uid,
          };

          this.http.post<AddProfessorDataResponse>(url, data).subscribe(
            (res) => {
              resolve(
                `Added ${res.classesAdded} classes for ${this.prettifyName(
                  professorName
                )}`
              );
            },
            () => {
              reject(
                `An error occured while adding classes for ${this.prettifyName(
                  professorName
                )}`
              );
            }
          );
        } else {
          reject('Unable to Authenticate');
        }
      });
    });
  }

  getClassDetails(professorId: string, classId: string): Observable<ClassData> {
    return this.db
      .collection('professors')
      .doc<Professor>(professorId)
      .collection('classes')
      .doc<ClassData>(classId)
      .valueChanges();
  }
  prettifyName(name: string) {
    const parts = name.split(',');
    if (parts.length === 1) {
      return parts[0];
    }
    if (parts.length === 2) {
      return parts[0] + ', ' + parts[1];
    }

    let prettifiedName = parts[0] + ',';

    for (let i = 1; i < parts.length; i++) {
      prettifiedName += ' ' + parts[i];
    }
    return prettifiedName;
  }
}
