import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  /**
   * Object holding user data for login
   * @property {string} username - The user's username
   * @property {string} password - The user's password
   */
  @Input() userData = { username: '', password: '' };

  /**
   * Creates an instance of UserLoginFormComponent.
   * @param fetchApiData - API data fetching service.
   * @param dialogRef - Angular Material dialog reference.
   * @param snackBar - Angular Material snackbar service.
   * @param router - Angular Router service.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router 
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {}

  /**
   * Logs in the user by sending the user data to the backend.
   * On success, stores user data and token in local storage, closes the dialog, shows a success message, and navigates to the movies page.
   * On failure, shows an error message.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        // Logic for a successful user login
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.dialogRef.close(); 
        this.snackBar.open('user logged in successfully', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['movies'])
      },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
