import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { ClassData } from 'src/app/types/class-data';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.scss'],
})
export class ClassDetailsComponent implements OnInit, OnDestroy {
  classDetails: Observable<ClassData>;
  classId: string;
  professorId: string;

  barChartOptions: ChartOptions = {
    responsive: true,
    legend: null,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      // xAxes: [{ categoryPercentage: 1.0, barPercentage: 1.0 }],
      xAxes: [{}],
      yAxes: [{}],
    },
  };

  barChartLabels: Label[] = ['A', 'B', 'C', 'D', 'F'];
  barChartData: ChartDataSets[];
  barChartDataSub: Subscription;

  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.classId = this.activatedRoute.snapshot.paramMap.get('classId');
    this.professorId = this.activatedRoute.snapshot.paramMap.get('professorId');
    this.classDetails = this.dataService.getClassDetails(
      this.professorId,
      this.classId
    );
    this.barChartDataSub = this.classDetails.subscribe((details) => {
      if (details !== undefined) {
        this.barChartData = [
          { data: [details.a, details.b, details.c, details.d, details.f] },
        ];
      }
    });
  }

  ngOnDestroy() {
    this.barChartDataSub.unsubscribe();
  }
}
