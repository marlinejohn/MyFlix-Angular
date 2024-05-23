import { Component, OnInit} from '@angular/core';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * The WelcomePageComponent is the landing page of the application.
 * It contains methods to open dialogs for user registration and login.
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
   /**
   * Creates an instance of WelcomePageComponent.
   * @param dialog - MatDialog to handle dialog opening.
   */
  constructor(public dialog: MatDialog) { }
   /**
   * Initializes the component.
   */
  ngOnInit(): void {}

// This is the function that will open the dialog when the signup button is clicked  
 /**
   * Opens the user registration dialog.
   */
openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
    width: '280px'
    });
  }
  /**
   * Opens the user login dialog.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
    width: '280px'
    });
  }


}
