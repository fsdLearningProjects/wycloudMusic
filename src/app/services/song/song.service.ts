/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-18 04:08:40
 */
import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_URL } from '../services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { SongUrl, Song, Lyric } from '../data-types/common.types';

@Injectable({
    providedIn: ServicesModule
})
export class SongService {
    constructor(
        private http: HttpClient,
        @Inject(API_URL) private url: string
    ) {}

    getSongUrl(ids: string): Observable<SongUrl[]> {
        const params = new HttpParams().set('id', ids);
        return this.http
            .get(this.url + 'song/url', { params })
            .pipe(map((res: { data: SongUrl[] }) => res.data));
    }

    getSongList(songs: Song | Song[]): Observable<Song[]> {
        const songArr = Array.isArray(songs) ? songs.slice() : [songs];
        const ids = songArr.map(item => item.id).join(',');
        return this.getSongUrl(ids).pipe(
            map(songUrls => this.generateSongList(songArr, songUrls))
        );
    }

    private generateSongList(songs: Song[], songUrls: SongUrl[]): Song[] {
        const result = [];
        songs.forEach(song => {
            const url = songUrls.find(songUrl => songUrl.id === song.id).url;
            if (url) {
                result.push({ ...song, url });
            }
        });
        return result;
    }

    // 歌曲详情
    getSongDetail(ids: string): Observable<Song> {
        const params = new HttpParams().set('ids', ids);
        return this.http
            .get(this.url + 'song/detail', { params })
            .pipe(map((res: { songs: Song }) => res.songs[0]));
    }

    // 获取歌词
    getSongLyric(id: number): Observable<Lyric> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.get(this.url + 'lyric', { params }).pipe(
            map((res: { [key: string]: { lyric: string } }) => {
                try {
                    return {
                        lyric: res.lrc.lyric,
                        tlyric: res.tlyric.lyric
                    };
                } catch (error) {
                    return {
                        lyric: '',
                        tlyric: ''
                    };
                }
            })
        );
    }
}
