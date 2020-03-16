/*
 * @Date: 2020-03-16 18:24:51
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-16 19:02:32
 */
import { Injectable } from '@angular/core';
import { SheetDetailModule } from '../sheet-detail.module';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { SongSheet } from 'src/app/services/data-types/common.types';
import { Observable } from 'rxjs';
import { SheetService } from 'src/app/services/sheet/sheet.service';

@Injectable()
export class SheetDetailResolverService implements Resolve<SongSheet> {
    constructor(private sheetService: SheetService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<SongSheet> {
        return this.sheetService.getSongSheetDetail(+route.paramMap.get('id'));
    }
}
