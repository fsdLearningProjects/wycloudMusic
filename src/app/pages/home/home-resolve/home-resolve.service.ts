import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-types/common.types';
import { HomeService } from 'src/app/services/home/home.service';
import { SingerService } from 'src/app/services/singer/singer.service';
import { Observable, forkJoin } from 'rxjs';
import { first } from 'rxjs/internal/operators';

@Injectable()
export class HomeResolveService implements Resolve<[Banner[], HotTag[], SongSheet[], Singer[]]> {

  constructor(private homeService: HomeService, private singerService: SingerService) { }

  resolve(): Observable<[Banner[], HotTag[], SongSheet[], Singer[]]> {
    return forkJoin(
      this.homeService.getBanners(),
      this.homeService.getHotTags(),
      this.homeService.getPersonalSheetList(),
      this.singerService.getEnterSinger()
    ).pipe(first());
  }

}
