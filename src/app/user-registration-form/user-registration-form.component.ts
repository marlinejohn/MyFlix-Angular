import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * The UserRegistrationFormComponent is used for user registration.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})

export class UserRegistrationFormComponent implements OnInit {
    /**
   * Holds the user's registration data.
   */
  @Input() userData = { username: '', password: '', email: '', birthDate: '' };

   /**
   * Creates an instance of UserRegistrationFormComponent.
   * @param fetchApiData - Service to interact with the API.
   * @param dialogRef - Reference to the dialog opened.
   * @param snackBar - Service to show snack bar notifications.
   * @param router - Router to navigate after registration.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Initializes the component.
   */
  ngOnInit(): void {}

 /**
   * Registers a new user by sending userData to the backend.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        // Logic for a successful user registration goes here! (To be implemented)
        localStorage.setItem('user', JSON.stringify(result));
        localStorage.setItem('token', result.token);
        console.log(localStorage.getItem('user') + "  kar lo baat  " + localStorage.getItem('token'))
        this.dialogRef.close(); 
        console.log(result);
        this.snackBar.open('user registered successfully', 'OK', {
          duration: 2000,
        });
        const userData = { username: this.userData.username, password: this.userData.password };
        this.loginUser(userData)
      },
      (result) => {
        console.log(result);
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      }
    );
  }

  /**
   * Logs in a user after successful registration.
   * @param loginUserData - The user's login data.
   */
  loginUser(loginUserData: any ): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        // Logic for a successful user login
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        
        console.log(localStorage.getItem('user') + "  kar lo baat  " + localStorage.getItem('token'))
        this.dialogRef.close(); 
        console.log(result);
        this.snackBar.open('user logged in successfully', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['movies'])
      },
      (result) => {
        console.log(result);
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}