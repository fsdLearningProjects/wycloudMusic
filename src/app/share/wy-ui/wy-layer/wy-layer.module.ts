/*
 * @Date: 2020-05-23 16:22:54
 * @LastEditors: fashandian
 * @LastEditTime: 2020-05-30 22:54:20
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { NzButtonModule } from 'ng-zorro-antd';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [WyLayerModalComponent, WyLayerDefaultComponent],
    imports: [CommonModule, NzButtonModule, DragDropModule],
    exports: [WyLayerModalComponent, WyLayerDefaultComponent],
})
export class WyLayerModule {}
