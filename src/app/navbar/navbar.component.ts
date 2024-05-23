import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
   /**
   * Stores the username of the logged-in user.
   */
  public username: string = "";

  /**
   * Creates an instance of NavbarComponent.
   * @param snackBar - Angular Material snackbar service.
   * @param router - Angular Router service.
   */
  constructor(
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * Retrieves the username from local storage and assigns it to the `username` property.
   */
  ngOnInit(): void {
    this.username = JSON.parse(localStorage.getItem("user")!).username;
  }

    /**
   * Navigates to the movies page.
   */
  public openMovies(): void {
    this.router.navigate(['movies']);
  }

   /**
   * Navigates to the profile page.
   */
  public openProfile(): void {
    this.router.navigate(['profile']);
  }

   /**
   * Logs out the user by clearing the token and user data from local storage.
   * Displays a logout confirmation message and navigates to the welcome page.
   */
  public logoutUser(): void {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    this.snackBar.open('You have been logged out', 'OK', {
      duration: 2000,
    });
    this.router.navigate(['welcome']);
  }


}
