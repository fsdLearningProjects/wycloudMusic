/*
 * @Date: 2020-05-23 16:22:54
 * @LastEditors: fashandian
 * @LastEditTime: 2020-05-23 16:48:22
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { NzButtonModule } from 'ng-zorro-antd';

@NgModule({
    declarations: [WyLayerModalComponent, WyLayerDefaultComponent],
    imports: [CommonModule, NzButtonModule],
    exports: [WyLayerModalComponent, WyLayerDefaultComponent],
})
export class WyLayerModule {}
