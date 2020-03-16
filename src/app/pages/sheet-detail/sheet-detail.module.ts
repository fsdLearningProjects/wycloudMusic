/*
 * @Date: 2020-03-16 17:57:54
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-16 19:03:35
 */
import { NgModule } from '@angular/core';

import { SheetDetailRoutingModule } from './sheet-detail-routing.module';
import { SheetDetailComponent } from './sheet-detail.component';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
    declarations: [SheetDetailComponent],
    imports: [ShareModule, SheetDetailRoutingModule]
})
export class SheetDetailModule {}
