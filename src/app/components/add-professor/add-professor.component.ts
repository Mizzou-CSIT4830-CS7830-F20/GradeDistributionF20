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
  ) {}

  ngOnInit(): void {}

  onSearchChange(searchVal: string) {}

  async onProfessorSelect(professorName: string) {}
}
