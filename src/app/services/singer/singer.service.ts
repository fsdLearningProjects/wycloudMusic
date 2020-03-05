import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_URL } from '../services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { Singer } from '../data-types/common.types';
import queryString from 'query-string';

interface SingerParams {
  offset: number;
  limit: number;
  cat?: string;
}

@Injectable({
  providedIn: ServicesModule
})
export class SingerService {

  constructor(private http: HttpClient, @Inject(API_URL) private url: string) { }

  getEnterSinger(args: SingerParams = { offset: 0, limit: 9, cat: '5001' }): Observable<Singer[]> {
    const params = new HttpParams({ fromString: queryString.stringify(args) });
    return this.http.get(this.url + 'artist/list', { params }).pipe(map((res: { artists: Singer[] }) => res.artists));
  }

}
