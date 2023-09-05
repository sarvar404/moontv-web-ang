import { Injectable } from "@angular/core";
import { GlobalService } from "./global.service";
import { Observable, catchError, of, switchMap, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Poster } from "../model/poster";

@Injectable()
export class TvShowsService {

    constructor(private globalService:GlobalService,
        private _httpCliet: HttpClient){   
    }

    getTvShowsData(data : { genre: number, order: string, page: number}): Observable<Poster[]> {
        const headers = GlobalService.getNoCacheHeaders();
        return this._httpCliet.get<Poster[]>(`${GlobalService.apiHost}/api/serie/by/filtres/${data.genre}/${data.order}/${data.page}/${GlobalService.apiToken}/${GlobalService.itemPurchaseCode}/`, 
         {
            headers
        }).pipe( catchError( (err) => {
            console.log(err);
            return throwError(err);
        }), switchMap((response: any) => {
            console.log(response);
            return of(response);   
        }));
    }


    getSeasonsBySerie(id: number): Observable<any[]> {
        const headers = GlobalService.getNoCacheHeaders();
        return this._httpCliet.get<Poster[]>(`${GlobalService.apiHost}/api/season/by/serie/${id}/${GlobalService.apiToken}/${GlobalService.itemPurchaseCode}/`, 
         {
            headers
        }).pipe( catchError( (err) => {
            console.log(err);
            return throwError(err);
        }), switchMap((response: any) => {
            console.log(response);
            return of(response);   
        }));
    }
    

}