/*
 * @Date: 2020-03-18 16:54:24
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-18 16:58:19
 */
import { NgModule } from '@angular/core';

import { ShareModule } from 'src/app/share/share.module';
import { SingerRoutingModule } from './singer-routing.module';
import { SingerDetailComponent } from './singer-detail/singer-detail.component';

@NgModule({
    declarations: [SingerDetailComponent],
    imports: [ShareModule, SingerRoutingModule]
})
export class SingerModule {}
