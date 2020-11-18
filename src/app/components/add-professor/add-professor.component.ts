import { Component, OnInit } from '@angular/core';
import * as professors from 'src/assets/prof_names.json';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data/data.service.js';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-professor',
  templateUrl: './add-professor.component.html',
  styleUrls: ['./add-professor.component.scss'],
})
export class AddProfessorComponent implements OnInit {
  choices: string[];
  filteredChoices: string[];
  isLoading = false;
  constructor(
    private matDialog: MatDialogRef<AddProfessorComponent>,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {
    this.choices = professors.names;
    this.filteredChoices = this.choices.slice(0, 100);
  }

  ngOnInit(): void {}

  onSearchChange(searchVal: string) {
    const searchValUpper = searchVal.toUpperCase();

    this.filteredChoices = this.choices
      .filter((professor) => {
        return professor.toUpperCase().includes(searchValUpper);
      })
      .slice(0, 100);
  }

  async onProfessorSelect(professorName: string) {
    this.isLoading = true;

    this.dataService
      .addProfessorData(professorName)
      .then((successMsg) => {
        console.log(successMsg);

        this.isLoading = false;
        this.snackBar.open(successMsg, null, { duration: 5000 });
        this.matDialog.close();
      })
      .catch((errMsg) => {
        console.log(errMsg);
        this.isLoading = false;
        this.snackBar.open(errMsg, null, { duration: 5000 });
      });
  }
}
