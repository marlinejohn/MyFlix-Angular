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
  @Input()
  isFromFav: boolean = false;

  movies: any[] = [];
  genre: any = '';
  director: any = '';
  user: any = {};
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getFavorites();
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      if (this.isFromFav) this.getFavouriteMovies()
      return this.movies;
    });
  }

  getFavouriteMovies(): void {
    this.movies = this.movies.filter(({ title }) => this.favoriteMovies.includes(title));
  }

  getFavorites(): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.favoriteMovies = parsedUser.favoriteMovies
    }
  }

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

  openSynopsisDialog(movieName: string, description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        title: movieName,
        description: description,
      },
      width: '500px',
    });
  }

  isFav(movie: any): boolean {
    return this.favoriteMovies.includes(movie.title);
  }

  toggleFav(movie: any): void {
    console.log('toggleFav called with movie:', movie);
    const isFavorite = this.isFav(movie);
    console.log('isFavorite:', isFavorite);
    isFavorite ? this.deleteFavMovies(movie) : this.addFavMovies(movie);
  }

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
