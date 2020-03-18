/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-18 16:57:57
 */
import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';
import { SheetListModule } from './sheet-list/sheet-list.module';
import { SheetDetailModule } from './sheet-detail/sheet-detail.module';
import { SongDetailModule } from './song-detail/song-detail.module';
import { SingerModule } from './singer/singer.module';

@NgModule({
    declarations: [],
    imports: [
        HomeModule,
        SheetListModule,
        SheetDetailModule,
        SongDetailModule,
        SingerModule
    ],
    exports: [
        HomeModule,
        SheetListModule,
        SheetDetailModule,
        SongDetailModule,
        SingerModule
    ]
})
export class PagesModule {}
