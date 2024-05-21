import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  @Input() userData = {
    username: '',
    password: '',
    email: '',
    birthDate: new Date(),
  };
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  updateUser(): void {
    this.fetchApiData.editUser( this.userData).subscribe(
      (result) => {
        console.log(result);
        this.dialogRef.close();
        this.snackBar.open('Update successful', 'OK', {
          duration: 2000,
        });
      },
      (result) => {
        this.snackBar.open(
          'Update not successful, please try again',
          'NOT OK',
          {
            duration: 2000,
          }
        );
      }
    );
  }
}
