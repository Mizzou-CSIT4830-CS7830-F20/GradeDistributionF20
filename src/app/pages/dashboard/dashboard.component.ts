import { Component, OnInit } from '@angular/core';
import { prettifyName } from '../../../utils';
import { DataService } from 'src/app/services/data/data.service';
import { Observable } from 'rxjs';
import { Professor } from 'src/types';
import { MatDialog } from '@angular/material/dialog';
import { AddProfessorComponent } from 'src/app/components/add-professor/add-professor.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CardResizeService } from 'src/app/services/card-resize/card-resize.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  professors: Observable<Professor[]>;

  constructor(
    public dataService: DataService,
    private dialog: MatDialog,
    private authService: AuthService,
    public cardResizeService: CardResizeService
  ) {
    this.professors = dataService.getProfessors();
  }

  ngOnInit(): void {
  }

  public formatName(name: string): string {
    return prettifyName(name);
  }

  addProfessor() {
    this.dialog.open(AddProfessorComponent, {
      width: '360px',
      disableClose: true
    });
  }

  logout() {
    this.authService.logout();
  }

}
