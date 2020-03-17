/*
 * @Date: 2020-03-18 02:56:58
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-18 03:28:06
 */
import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Song, Lyric } from 'src/app/services/data-types/common.types';
import { Observable, forkJoin } from 'rxjs';
import { SongService } from 'src/app/services/song/song.service';
import { first } from 'rxjs/internal/operators';

type SongDataModel = [Song, Lyric];

@Injectable()
export class SongDetailResolverService implements Resolve<SongDataModel> {
    constructor(private songService: SongService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<SongDataModel> {
        const id = route.paramMap.get('id');
        return forkJoin([
            this.songService.getSongDetail(id),
            this.songService.getSongLyric(+id)
        ]).pipe(first());
    }
}
