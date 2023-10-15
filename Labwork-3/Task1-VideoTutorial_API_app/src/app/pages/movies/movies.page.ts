import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { observeOn } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';
/*interface Movie {
  id: any;
  title: any;
  type: any[];
  // Define other properties of a movie
}*/
@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})


export class MoviesPage implements OnInit {
  movies = [];
  currentPage = 1;
  imageBaseUrl = environment.images;
 
  constructor(
    private movieService: MovieService,
    private loadingCtrl: LoadingController
  ) {}
 
  ngOnInit() {
    this.loadMovies();
  }
 
  async loadMovies(event?: InfiniteScrollCustomEvent | undefined) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();
 
    this.movieService.getTopRatedMovies(this.currentPage).subscribe(
      (res) => {
        loading.dismiss();
        this.movies.push(...res.results);
 
        event?.target.complete();
        if (event) {
          event.target.disabled = res.total_pages === this.currentPage;
        }
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }
 
  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }
}