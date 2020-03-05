import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesModule, API_URL } from '../services.module';
import { Banner, HotTag, SongSheet } from '../data-types/common.types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';


@Injectable({
  // 这样子写，如果没使用到，可以被 tree-shaking 掉
  // 对应的，如果使用 providers，没使用到，也不会被 tree-shaking 掉
  providedIn: ServicesModule
})
export class HomeService {

  constructor(private http: HttpClient, @Inject(API_URL) private url: string) { }

  getBanners(): Observable<Banner[]> {
    return this.http.get(this.url + 'banner').pipe(map((res: { banners: Banner[] }) => res.banners));
  }

  getHotTags(): Observable<HotTag[]> {
    return this.http.get(this.url + 'playlist/hot').pipe(map((res: { tags: HotTag[] }) => res.tags.sort((x: HotTag, y: HotTag) => x.position - y.position).slice(0, 5)));
  }

  getPersonalSheetList(): Observable<SongSheet[]> {
    return this.http.get(this.url + 'personalized').pipe(map((res: { result: SongSheet[] }) => res.result.slice(0, 16)));
  }

}
