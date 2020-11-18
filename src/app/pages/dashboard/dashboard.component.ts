import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Observable } from 'rxjs';
import { Professor } from 'src/app/types/professor';
import { MatDialog } from '@angular/material/dialog';
import { AddProfessorComponent } from 'src/app/components/add-professor/add-professor.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CardResizeService } from 'src/app/services/card-resize/card-resize.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  professors: Observable<Professor[]>;

  constructor(
    public dataService: DataService,
    private dialog: MatDialog,
    private authService: AuthService,
    public cardResizeService: CardResizeService
  ) {
    this.authService.checkUser().then((user) => {
      if (user) {
        this.professors = dataService.getProfessors(user.uid);
      }
    });
  }

  ngOnInit(): void {}

  formatName(name: string): string {
    return this.dataService.prettifyName(name);
  }

  addProfessor() {
    this.dialog.open(AddProfessorComponent, {
      width: '360px',
      disableClose: true,
    });
  }

  logout() {
    this.authService.logout();
  }
}
