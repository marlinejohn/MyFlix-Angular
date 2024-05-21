import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public username: string = "";

  constructor(
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.username = JSON.parse(localStorage.getItem("user")!).username;
  }

  // Function to navigate to the movies page.
  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  // Function to navigate to the profile page.
  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  // Function to log out the user.
  public logoutUser(): void {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    this.snackBar.open('You have been logged out', 'OK', {
      duration: 2000,
    });
    this.router.navigate(['welcome']);
  }


}
