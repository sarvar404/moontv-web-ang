import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Genere } from 'src/app/model/genere';
import { Poster } from 'src/app/model/poster';
import { GenreService } from 'src/app/services/genre.service';

import { TvShowsService } from 'src/app/services/tv-shows.service';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { AppContants } from 'src/app/utils/app-contants';
@Component({
  selector: 'app-tv-show-list',
  templateUrl: './tv-show-list.component.html',
  styleUrls: ['./tv-show-list.component.scss']
})
export class TvShowListComponent implements OnInit, OnDestroy {
  @ViewChild('aside') aside: ElementRef<HTMLElement> | undefined;
  loading: boolean = true;
  dataloading: boolean = false;
  pausePagination: boolean = false;
  paginationLoading: boolean = false;
  currentPage: number = 0;
  genres: Genere[] = [];
  posters: Poster[] = [];
  temp: Poster[] = [];
  paginationMap: Map<number, Poster[]> = new Map();
  paginatedPosters: any = [];
  filterMovieGenres = [33, 63, 44, 32, 30, 31, 35, 42, 62, 5, 6, 7, 9, 10, 11, 12, 13, 18, 14, 19, 20, 22, 23, 45, 60];
  selectedGenre: Genere = { id: 0, title: "All TV Shows", posters: [] };
  switchlang = 'en'
  @ViewChild('myModal') modalElement!: ElementRef;
  constructor(private _tvShoesService: TvShowsService,
    private _genreService: GenreService,
    private route: ActivatedRoute,
    private location: Location,
    private sharedService: SharedService,
    private router: Router) {


      
  }

  closeModelAutomatically() {
    const modal: any = this.modalElement.nativeElement;
    modal.click();
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.temp = [];
      this.paginatedPosters = [];
      this.loading = true;
      this.paginationMap = new Map();
      //this.genres = [];
      if (typeof id === 'undefined' || id == 0) {
        this.selectedGenre = { id: 0, title: "All TV Shows", posters: [] };
      } else {
        this.selectedGenre = { id: id, title: "", posters: [] };
      }
      this.getGeneres({ genre: 'all' });
      this.loadTvShowPageData({ genre: id, order: 'created', page: 0 });
      window.addEventListener('scroll', this.scroll, true);
      this.selectItem();
    });
    this.location.replaceState('/');
  }

  ngAfterViewInit(): void {
    console.log(this.modalElement);
    //this.selectItem();
  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);

  }
  selectItem() {
    setTimeout(() => {
      if (this.aside) {
        const aside = this.aside.nativeElement;
        const selectedItem = aside.querySelector('.genre-submenu_selected') as HTMLElement;;
        if (selectedItem) {
          const scrollTop = selectedItem.offsetTop;
          document.getElementsByClassName('genre-submenu_genre_submenu_scrollable')[0].scrollTop = scrollTop;
        }
      }
    },
      1000);

  }
  scroll = (event: any): void => {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;

    if(this.paginatedPosters.length == 0){
      // no need to check for scroll end for pagination. since it may be new genre clicked or no records found for selected genre
      return;
    }
    if (!this.paginationLoading && !this.pausePagination) {
      if (windowBottom >= docHeight) {
        // console.log("do something when scroll to the bottom of the page");
        //this.dataloading = true;
        this.paginationLoading = true;
        this.loadTvShowPageData({ genre: this.selectedGenre?.id!, order: 'created', page: this.getNextPageNumber()+1 });
      }
    }
  };
  getDetails(poster: Poster) {
    if (typeof poster !== 'undefined') {
      this.sharedService.setSharedObject(poster);
      this.router.navigate(['/details']);
    }
  }
  onGenreClick(genre: Genere) {
    this.paginationLoading = false;
    this.dataloading = true;
    this.pausePagination = false;
    this.selectedGenre = genre;
    this.getGenreById(genre.id);
    this.closeModelAutomatically();
    
  }
  getGeneres(data: { genre: string }) {
    this._genreService.getGenere(data).subscribe((resp) => {
       console.log('generesss',resp);
      this.genres = [];
      this.genres.push({ id: 0, title: "All TV Shows", posters: [] });
      resp.sort((a, b) => {
        if (a.title! < b.title!) { return -1; }
        if (a.title! > b.title!) { return 1; }
        return 0;
      });
      resp.forEach(genre => {
        if (this.filterMovieGenres.indexOf(genre.id!) >= 0) {
          this.genres.push(genre);
          if (this.selectedGenre.title == '' && this.selectedGenre.id == genre.id) {
            this.selectedGenre = genre
          }
        }

      });
    })
  }
  chunkArray<T>(posters: Poster[], size: number): any {
    const results: any = [];
    for (let i = 0; i < posters.length; i += size) {
      const chunk = posters.slice(i, i + size);
      results.push(chunk);
    }

    return results;
  }
  getGenreById(id: any) {

    console.log(id);
    this.currentPage = 0;
    this.temp = [];
    this.posters = [];
    this.paginatedPosters = [];
    this.paginationMap = new Map();
    this.loadTvShowPageData({ genre: id, order: 'created', page: 0 });
    window.scrollTo(0, 0);
  }
  getNextPageNumber(): number {
    if(this.paginationMap.size === 0) return -1;
    const keysArray = Array.from(this.paginationMap.keys());
    return keysArray[keysArray.length - 1]; 
   
  }
  loadTvShowPageData(data: { genre: number, order: string, page: number }): void {
    // this.posters =[];
    console.log('data', data);
    // if(msg == 'fromGenre'){
    //  this.posters =[];
    // }
    this._tvShoesService.getTvShowsData(data).subscribe({
      next: (resp: Poster[]) => {
        console.log(resp);
        if (resp.length > 0) {
          // remove adult content from all tvshows category
          const filteredShows = resp.filter((movie: Poster) => {
            return !movie.genres?.some((genre) => genre.id === AppContants.GENRE_ADULT);
          });
          this.posters = [...this.temp, ...filteredShows];
          this.temp = this.posters;
          this.paginatedPosters.push(filteredShows);

        }
        else {
          this.pausePagination = true;
        }

      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        this.loading = false;
        this.dataloading = false;
        this.paginationLoading = false;
        console.log("completed");
      }
    })
  }
}

