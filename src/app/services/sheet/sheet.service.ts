/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-16 18:13:29
 */
import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_URL } from '../services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SongSheet, Song, SheetList } from '../data-types/common.types';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { SongService } from '../song/song.service';
import queryString from 'query-string';

export interface SheetParams {
    offset: number;
    limit: number;
    order: 'new' | 'hot';
    cat: string;
}

@Injectable({
    providedIn: ServicesModule
})
export class SheetService {
    constructor(
        private http: HttpClient,
        @Inject(API_URL) private url: string,
        private songService: SongService
    ) {}

    getSheets(args: SheetParams): Observable<SheetList> {
        const params = new HttpParams({
            fromString: queryString.stringify(args)
        });
        return this.http
            .get(this.url + 'top/playlist', { params })
            .pipe(map(res => res as SheetList));
    }

    /** 获取歌单详情 */
    getSongSheetDetail(id: number): Observable<SongSheet> {
        const params = new HttpParams().set('id', id.toString());
        return this.http
            .get(this.url + 'playlist/detail', { params })
            .pipe(map((res: { playlist: SongSheet }) => res.playlist));
    }

    playSheet(id: number): Observable<Song[]> {
        return this.getSongSheetDetail(id).pipe(
            pluck('tracks'),
            switchMap(tracks => this.songService.getSongList(tracks))
        );
    }
}
