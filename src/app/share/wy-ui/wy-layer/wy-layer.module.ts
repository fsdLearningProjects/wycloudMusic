/*
 * @Date: 2020-05-23 16:22:54
 * @LastEditors: fashandian
 * @LastEditTime: 2020-06-06 20:07:57
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { NzButtonModule } from 'ng-zorro-antd';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WyLayerLoginComponent } from './wy-layer-login/wy-layer-login.component';

@NgModule({
    declarations: [
        WyLayerModalComponent,
        WyLayerDefaultComponent,
        WyLayerLoginComponent,
    ],
    imports: [CommonModule, NzButtonModule, DragDropModule],
    exports: [
        WyLayerModalComponent,
        WyLayerDefaultComponent,
        WyLayerLoginComponent,
    ],
})
export class WyLayerModule {}
