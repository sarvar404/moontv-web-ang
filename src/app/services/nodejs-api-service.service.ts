import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Observable, catchError, of, switchMap, throwError } from "rxjs";
import { Poster } from 'src/app/model/poster';

@Injectable({
  providedIn: 'root',
})
export class NodejsApiService {

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
    ) {}

  verifyPinForUser(authHeaders: any, pin: any) {
    // Ensure that 'pin' is a valid number
    // if (typeof pin !== 'number') {
    //   throw new Error('Invalid PIN');
    // }

    // Use the static method from GlobalService to get security headers
    const securityHeaders = GlobalService.getAuthHeaders();
    const xHeader = securityHeaders.get('x-security-header');

    if (xHeader === null) {
      throw new Error('x-security-header not found in headers');
    }

    // Create the headers with the 'x-security-header' and other required headers
    const headers = new HttpHeaders({
      'x-security-header': xHeader, // Get the 'x-security-header' value
      'x-auth-header': authHeaders.accessToken,
      'x-user-id': authHeaders.id,
    });

    // Make the POST request with headers
    return this.http.post(
      `${GlobalService.apiHostPublic}/api/public/verify-adult-pin`,
      { pin },
      { headers }
    );
  }

  getMovieData(data: { genre: number, order: string, page: number }): Observable<Poster[]> {
    const securityHeaders = GlobalService.getAuthHeaders();
    const xHeader = securityHeaders.get('x-security-header');

    if (xHeader === null) {
      throw new Error('x-security-header not found in headers');
    }

    // Create the headers with the 'x-security-header' and other required headers
    const headers = new HttpHeaders({
      'x-security-header': xHeader
    });

    // Adjust the URL as needed to match your Node.js API endpoint
    const apiUrl = `${GlobalService.apiHostPublic}/api/public/get-adults-movie-detail`;

    return this.http.get<any>(apiUrl, { headers }).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      }),
      switchMap((response: any) => {
        if (response.success === true) {
          return of(response.movies); // Adjust the response mapping to match your API structure
        } else {
          return throwError('API request failed'); // Handle the error case
        }
      })
    );
  }

  getTvShowsData(data: { genre: number, order: string, page: number }): Observable<Poster[]> {
    const securityHeaders = GlobalService.getAuthHeaders();
    const xHeader = securityHeaders.get('x-security-header');

    if (xHeader === null) {
      throw new Error('x-security-header not found in headers');
    }

    // Create the headers with the 'x-security-header' and other required headers
    const headers = new HttpHeaders({
      'x-security-header': xHeader
    });

    // Adjust the URL as needed to match your Node.js API endpoint
    const apiUrl = `${GlobalService.apiHostPublic}/api/public/get-adults-webshow-detail`;

    return this.http.get<any>(apiUrl, { headers }).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      }),
      switchMap((response: any) => {
        if (response.success === true) {
          return of(response.webshows); // Adjust the response mapping to match your API structure
        } else {
          return throwError('API request failed'); // Handle the error case
        }
      })
    );
  }

  // Other methods for your API calls...
}
