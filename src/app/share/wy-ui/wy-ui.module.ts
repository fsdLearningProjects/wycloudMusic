import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../pipes/play-count/play-count.pipe';
import { WyPlayerModule } from './wy-player/wy-player.module';



@NgModule({
  declarations: [
    SingleSheetComponent,
    PlayCountPipe
  ],
  imports: [
    WyPlayerModule
  ],
  exports: [
    WyPlayerModule,
    SingleSheetComponent,
    PlayCountPipe
  ]
})
export class WyUiModule { }
