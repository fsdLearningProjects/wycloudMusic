/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-05-23 16:25:58
 */
import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../pipes/play-count/play-count.pipe';
import { WyPlayerModule } from './wy-player/wy-player.module';
import { WySearchModule } from './wy-search/wy-search.module';
import { WyLayerModule } from './wy-layer/wy-layer.module';

@NgModule({
    declarations: [SingleSheetComponent, PlayCountPipe],
    imports: [WyPlayerModule, WySearchModule, WyLayerModule],
    exports: [
        WyPlayerModule,
        SingleSheetComponent,
        PlayCountPipe,
        WySearchModule,
        WyLayerModule,
    ],
})
export class WyUiModule {}
