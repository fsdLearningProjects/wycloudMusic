/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-19 18:39:48
 */
import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../pipes/play-count/play-count.pipe';
import { WyPlayerModule } from './wy-player/wy-player.module';
import { WySearchModule } from './wy-search/wy-search.module';

@NgModule({
    declarations: [SingleSheetComponent, PlayCountPipe],
    imports: [WyPlayerModule, WySearchModule],
    exports: [
        WyPlayerModule,
        SingleSheetComponent,
        PlayCountPipe,
        WySearchModule
    ]
})
export class WyUiModule {}
