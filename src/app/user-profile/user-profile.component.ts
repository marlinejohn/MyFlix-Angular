import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  @Input() userData: any = {
    username: '',
    password: '',
    email: '',
    birthDate: '',
  };
  formUserData: any = {
    username: '',
    password: '',
    email: '',
  };

  user: any = {};
  movies: any[] = [];
  favoriteMovies: any[] = [];
  _id: any[] = [];

   /**
   * Creates an instance of UserProfileComponent.
   * @param fetchApiData - API data fetching service.
   * @param dialog - Angular Material dialog service.
   * @param snackBar - Angular Material snackbar service.
   * @param router - Angular Router service.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

   /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {
    this.getProfile();
  }
  /**
   * Fetches the user's profile information and favorite movies.
   * @returns void
   */
  public getProfile(): void {
    this.fetchApiData.getUser().subscribe((result: any) => {
      console.log(result);
      this.user = result;
      this.userData.username = this.user.username;
      this.userData.email = this.user.email;
      if (this.user.birthDate) {
        let Birthday = new Date(this.user.birthDate);
        if (!isNaN(Birthday.getTime())) {
          this.userData.birthDate = Birthday.toISOString().split('T')[0];
        }
      }
      this.formUserData = { ...this.userData };
      this.formUserData.password = this.user.password
      this._id = this.user.favoriteMovies;

      this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
        this.favoriteMovies = movies.filter((movie: any) =>
          this._id.includes(movie._id)
        );
      });
    });
  }

   /**
   * Updates the user's profile information.
   * @returns Promise<void>
   */
  async updateUser(): Promise<void> {
    let formData = this.formUserData;
    formData.birthDate = this.user.birthDate.slice(0, 10)
    console.log(formData);
    this.fetchApiData.editUser(formData).subscribe(
      (result: any) => {
        console.log('User update success:', result);
        localStorage.setItem('user', JSON.stringify(result));
        this.snackBar.open('User updated successfully!', 'OK', {
          duration: 2000,
        });
        this.getProfile();
      },
      (error) => {
        console.log('Error updating user:', error);
        this.snackBar.open('Failed to update user: ' + error, 'OK', {
          duration: 2000,
        });
      }
    );
  }

   /**
   * Deletes the user's account after confirmation.
   * @returns Promise<void>
   */
  async deleteUser(): Promise<void> {
    console.log('deleteUser function called:', this.userData.email);
    if (confirm('Do you want to delete your account permanently?')) {
      this.fetchApiData.deleteUser().subscribe(
        (result: any) => {
          this.snackBar.open('Account deleted successfully!', 'OK', {
            duration: 3000,
          });
          localStorage.clear();
          this.router.navigate(['welcome']);
        },
        (error) => {
          console.log('Error Deleteing User:', error);
          this.snackBar.open('Failed to delete user: ' + error, 'OK', {
            duration: 2000,
          });
          this.router.navigate(['welcome']);
        }
      );
    }
  }
}