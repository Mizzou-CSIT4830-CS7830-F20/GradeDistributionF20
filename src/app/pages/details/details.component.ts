import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Observable } from 'rxjs';
import { ClassData } from 'src/app/types/class-data';
import { Professor } from 'src/app/types/professor';
import { ActivatedRoute, Router } from '@angular/router';
import { CardResizeService } from 'src/app/services/card-resize/card-resize.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  classes: Observable<ClassData[]>;
  professorDetails: Observable<Professor>;
  professorId: string;
  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public cardResizeService: CardResizeService
  ) {}

  ngOnInit(): void {
    this.professorId = this.activatedRoute.snapshot.paramMap.get('id');
    this.classes = this.dataService.getClasses(this.professorId);
    this.professorDetails = this.dataService.getProfessorDetails(
      this.professorId
    );
  }
  goToClassDetails(classId: string) {
    this.router.navigate([`/classDetails/${this.professorId}/${classId}`]);
  }
}
