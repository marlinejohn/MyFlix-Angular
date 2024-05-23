import { Component, OnInit, Input } from '@angular/core';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';

import { FetchApiDataService } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  /**
 * Flag to indicate whether the component is displaying favorite movies.
 * Default value is false.
 */
  @Input()
  isFromFav: boolean = false;

  /**
 * Array to store all movies.
 */
  movies: any[] = [];
  /**
 * Information about the genre, director, user, and favorite movies.
 */
  genre: any = '';
  director: any = '';
  user: any = {};
  favoriteMovies: any[] = [];

  /**
 * Constructor of the MovieCardComponent class.
 * Initializes FetchApiDataService, MatDialog, and MatSnackBar.
 * @param fetchApiData - Service for fetching data from the API.
 * @param dialog - Service for opening dialogs.
 * @param snackBar - Service for displaying snack bar notifications.
 */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  /**
 * Lifecycle hook that is called after the component's view has been initialized.
 * Initializes the component by fetching favorites and movies.
 */
  ngOnInit(): void {
    this.getFavorites();
    this.getMovies();
  }

  /**
   * Fetches all movies from the database.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      if (this.isFromFav) this.getFavouriteMovies()
      return this.movies;
    });
  }

    /**
   * Filters movies to display only favorites.
   */

    /**
   * Retrieves user's favorite movies from local storage.
   */
  getFavouriteMovies(): void {
    this.movies = this.movies.filter(({ title }) => this.favoriteMovies.includes(title));
  }

  /**
   * Retrieves user's favorite movies from local storage.
   */
  getFavorites(): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.favoriteMovies = parsedUser.favoriteMovies
    }
  }

  /**
   * Opens dialog to display genre information.
   * @param genreName - The name of the genre.
   */
  openGenreDialog(genreName: string): void {
    this.fetchApiData.getOneGenre(genreName).subscribe((resp: any) => {
      this.genre = resp;      
      console.log(this.genre)
      this.dialog.open(GenreInfoComponent, {
        data: {
          name: this.genre.name,
          description: this.genre.description,
        },
        width: '500px',
      });
    });
  }

  /**
   * Opens dialog to display director information.
   * @param directorName - The name of the director.
   */
  openDirectorDialog(directorName: string): void {  
    this.fetchApiData.getOneDirector(directorName).subscribe((resp: any) => {
      this.director = resp;
      console.log(directorName)
      this.dialog.open(DirectorInfoComponent, {
        data: {
          name: this.director.name,
          bio: this.director.bio,
          birthDate: this.director.birthDate,
          deathDate: this.director.deathDate
        },
        width: '500px',
      });
    });
  }

  /**
   * Opens dialog to display movie synopsis.
   * @param movieName - The name of the movie.
   * @param description - The description of the movie.
   */
  openSynopsisDialog(movieName: string, description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        title: movieName,
        description: description,
      },
      width: '500px',
    });
  }

  /**
   * Checks if a movie is favorited by the user.
   * @param movie - The movie object.
   * @returns True if the movie is favorited, false otherwise.
   */
  isFav(movie: any): boolean {
    return this.favoriteMovies.includes(movie.title);
  }

   /**
   * Toggles the favorite status of a movie.
   * @param movie - The movie object.
   */
  toggleFav(movie: any): void {
    console.log('toggleFav called with movie:', movie);
    const isFavorite = this.isFav(movie);
    console.log('isFavorite:', isFavorite);
    isFavorite ? this.deleteFavMovies(movie) : this.addFavMovies(movie);
  }

   /**
   * Adds a movie to user's favorites.
   * @param movie - The movie object to be added.
   */
  addFavMovies(movie: any): void {
    let user = localStorage.getItem('user');

    if (user) {
      let parsedUser = JSON.parse(user);
      console.log('user:', parsedUser);
      console.log(user);

      this.fetchApiData
        .addFavoriteMovie(movie.title, parsedUser.username)
        .subscribe((resp: any) => {
          console.log('server response:', resp);
          localStorage.setItem('user', JSON.stringify(resp));
          // Add the movie ID to the favoritemovie array
          this.favoriteMovies.push(movie.title);
          console.log(this.favoriteMovies);
          // Show a snack bar message
          this.snackBar.open(
            `${movie.title} has been added to your favorites`,
            'OK',
            {
              duration: 3000,
            }
          );
        });
    }
  }

  /**
   * Deletes a movie from user's favorites.
   * @param movie - The movie object to be removed.
   */
  deleteFavMovies(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.fetchApiData
        .deleteFavoriteMovie(movie.title, parsedUser.username)
        .subscribe((resp) => {
          localStorage.setItem('user', JSON.stringify(resp));
          // Remove the movie ID from the favoritemovie array
          this.favoriteMovies = this.favoriteMovies.filter(
            (title) => title !== movie.title
          );
          // Show a snack bar message
          this.snackBar.open(
            `${movie.title} has been removed from your favorites`,
            'OK',
            {
              duration: 3000,
            }
          );
        });
    }
  }
}
