/*
 * @Date: 2020-03-20 02:02:19
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-20 03:48:16
 */
import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_URL } from '../services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Search } from '../data-types/common.types';
import { map } from 'rxjs/internal/operators';

@Injectable({
    providedIn: ServicesModule
})
export class SearchService {
    constructor(
        private http: HttpClient,
        @Inject(API_URL) private url: string
    ) {}

    search(keywords: string): Observable<Search> {
        const params = new HttpParams().set('keywords', keywords);
        return this.http
            .get(this.url + 'search/suggest', { params })
            .pipe(map((res: { result: Search }) => res.result));
    }
}
