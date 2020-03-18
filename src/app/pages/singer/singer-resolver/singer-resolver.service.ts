/*
 * @Date: 2020-03-18 17:12:37
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-18 17:15:54
 */
import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { SingerDetail } from 'src/app/services/data-types/common.types';
import { Observable } from 'rxjs';
import { SingerService } from 'src/app/services/singer/singer.service';

@Injectable()
export class SingerResolverService implements Resolve<SingerDetail> {
    constructor(private singerService: SingerService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<SingerDetail> {
        const id = route.paramMap.get('id');
        return this.singerService.getSingerDetail(id);
    }
}
