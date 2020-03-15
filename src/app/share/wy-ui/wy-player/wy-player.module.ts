/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-16 01:52:19
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WyPlayerComponent } from './wy-player.component';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import { FormatTimePipe } from '../../pipes/format-time/format-time.pipe';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { WyScrollComponent } from './wy-scroll/wy-scroll.component';
import { ClickOutsideDirective } from 'src/app/share/directives/click-outside/click-outside.directive';

@NgModule({
    declarations: [
        WyPlayerComponent,
        FormatTimePipe,
        WyPlayerPanelComponent,
        WyScrollComponent,
        ClickOutsideDirective
    ],
    imports: [CommonModule, FormsModule, WySliderModule],
    exports: [WyPlayerComponent, FormatTimePipe, ClickOutsideDirective]
})
export class WyPlayerModule {}
