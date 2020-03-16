/*
 * @Date: 2020-03-16 16:02:32
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-16 16:06:20
 */
import { NgModule } from '@angular/core';

import { SheetListRoutingModule } from './sheet-list-routing.module';
import { SheetListComponent } from './sheet-list.component';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
    declarations: [SheetListComponent],
    imports: [ShareModule, SheetListRoutingModule]
})
export class SheetListModule {}
