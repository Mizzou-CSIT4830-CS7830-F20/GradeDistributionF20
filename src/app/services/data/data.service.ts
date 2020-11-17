import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Professor } from 'src/app/types/professor';
import { ClassData } from 'src/app/types/class-data';
import { AddProfessorDataResponse } from 'src/app/types/add-professor-data-response';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private db: AngularFirestore,
    private http: HttpClient,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {}

  getProfessors(): Observable<Professor[]> {
    const currentUser = this.afAuth.currentUser;

    this.afAuth.currentUser.then((user) => {
      if (user) {
        return this.db
          .collection<Professor>('professors', (ref) =>
            ref.where('trackedBy', 'array-contains', user.uid)
          )
          .valueChanges()
          .pipe(
            map((professors) =>
              professors.sort((profA, profB) => {
                return profA.name > profB.name ? 1 : -1;
              })
            )
          );
      }
    });

    // this shouldn't happen, but just in case this will keep us from crashing
    return of([]);
  }

  getClasses(professorId: string): Observable<ClassData[]> {}

  getProfessorDetails(professorId: string): Observable<Professor> {}

  addProfessorData(professorName: string): Promise<string> {}

  getClassDetails(
    professorId: string,
    classId: string
  ): Observable<ClassData> {}
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
