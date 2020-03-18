/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-18 17:11:24
 */
import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_URL } from '../services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { Singer, SingerDetail } from '../data-types/common.types';
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
    constructor(
        private http: HttpClient,
        @Inject(API_URL) private url: string
    ) {}

    getEnterSinger(
        args: SingerParams = { offset: 0, limit: 9, cat: '5001' }
    ): Observable<Singer[]> {
        const params = new HttpParams({
            fromString: queryString.stringify(args)
        });
        return this.http
            .get(this.url + 'artist/list', { params })
            .pipe(map((res: { artists: Singer[] }) => res.artists));
    }

    // 获取歌手信息
    getSingerDetail(id: string): Observable<SingerDetail> {
        const params = new HttpParams().set('id', id);
        return this.http
            .get(this.url + 'artists', { params })
            .pipe(map(res => res as SingerDetail));
    }

    // 获取相似歌手
    getSimiSinger(id: string): Observable<Singer[]> {
        const params = new HttpParams().set('id', id);
        return this.http
            .get(this.url + 'simi/artist', { params })
            .pipe(map((res: { artists: Singer[] }) => res.artists));
    }
}
