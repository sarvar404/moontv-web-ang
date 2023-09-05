import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Genere } from 'src/app/model/genere';
import { GenreService } from 'src/app/services/genre.service';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { I18nService } from 'src/app/services/i18n.service';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.scss']
})
export class TopHeaderComponent implements OnInit {

  movieGenres: Genere[] = [];
  otherGenres: Genere[] = [];
  movieGenreGroups: any = [];
  otherGenreGroups: any = [];
  currentPath: string = "";
  filterMovieGenres = [ 0, 1, 2, 3,4 , 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 21, 45, 61];
  filterSeriesGenres = [33, 63, 44, 32, 30, 31, 35, 42, 62, 5, 6, 7, 9, 10, 11, 12, 13, 18, 14, 19, 20, 22, 23, 45, 60];
  currentUrl: string = '';
  userLoggedIn: boolean = false;
  isClicked: boolean = false;
  switchlang = 'en'
   translatedHeader: any;
   translations: any = {}; 
   showDropdown: boolean = false;
   
   isDropdownOpen: boolean = false;
   dropdownOpen: boolean = false;

  constructor(private _genreService: GenreService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _authService: AuthService,
    private location: Location,
    private i18nService: I18nService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.translate.setDefaultLang(this.switchlang);
  }
  
  ngOnInit(): void {
    this.movieGenres = [];
    this.otherGenres = [];
    this.movieGenreGroups = [];
    this.otherGenreGroups = [];
    this.loadMovieGenres();

    this.checkUserLoginStatus();
     this.translatedHeader = this.i18nService.getTranslatedData();
    //  this.translatedHeader = this.i18nService.translate.instant('HEADER');
     
  }
  toggleClick(): void {
    this.isClicked = !this.isClicked;
  }
  doLogout(): void {
    console.log('clicked');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      minWidth: "400px",
      data: {
        title: "Logout",
        message: "Are you sure you want to logout?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {

      console.log(dialogResult);
      if (dialogResult) {
        this._authService.doLogout().subscribe({
          complete: () => {
            this.userLoggedIn = false;
            // this.router.navigate(['new-home']);
            // location.reload();
            window.location.href = '/new-home';
          }
        });
      }

    });

  }
  getLoggedInUser(): string {
    return localStorage.getItem("username")!;
  }
  checkUserLoginStatus(): void {
    this._authService.check()
      .subscribe(_authenticated => {

        if (!_authenticated) {
          console.log(" Not logged in");
          this.userLoggedIn = false;
        } else {
          this.userLoggedIn = true;
        }


      })
      ;
  }
  chunkArray<T>(genres: Genere[], size: number): any {
    const results: any = [];
    for (let i = 0; i < genres.length; i += size) {
      const chunk = genres.slice(i, i + size);
      results.push(chunk);
    }

    return results;
  }

  loadMovieGenres(): void {
    this._genreService.getAllGenres().subscribe({
      next: (resp: Genere[]) => {
       // console.log(resp);

        this.movieGenres.push({ id: 0, title: "All Movies", posters: [] });
        this.otherGenres.push({ id: 0, title: "All TvShows", posters: [] });
        resp.sort((a, b) => {
          if (a.title! < b.title!) { return -1; }
          if (a.title! > b.title!) { return 1; }
          return 0;
        });
        resp.forEach(genre => {
          //console.log(resp);
          if (this.filterMovieGenres.indexOf(genre.id!) >= 0) {
            this.movieGenres.push(genre);
          } 
          if(this.filterSeriesGenres.indexOf(genre.id!) >= 0) {
            this.otherGenres.push(genre);
          }

        });
        this.movieGenreGroups = this.chunkArray(this.movieGenres, 8);
        this.otherGenreGroups = this.chunkArray(this.otherGenres, 12);
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {

        console.log("completed loading genres");
        const urlPaths = this.router.url.split('/');
        if (urlPaths.length > 0) {
          this.currentPath = urlPaths[1];

        }


      }
    })
  }

  openSignInDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {};
    const signInDialog = this.dialog.open(SignInComponent, dialogConfig);
    signInDialog.afterClosed().subscribe((res) => {
      this.checkUserLoginStatus();
    });
  }
  search(): void {
    this.router.navigate(['/search']);
  }
 
  loadTranslations() {
    this.translatedHeader = this.i18nService.translate('HEADER'); 
  }
  
changeLanguage(lang: string): void {
  this.translate.use(lang); // Set the selected language
}
onLanguageChange(event: any) {
  this.switchlang = event.target.value;
  this.translate.use(this.switchlang);
  this.cdr.detectChanges();
 

  this.translate.get(['HEADER']).subscribe((translatedTexts: any) => {
    this.translations = translatedTexts;
    
    
  });

  
}
toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}
// openDropdown() {
//   this.dropdownOpen = true;
//   setTimeout(() => {
//       this.dropdownOpen = false;
//   }, 3000); // 1000 milliseconds = 1 second
// }
}











