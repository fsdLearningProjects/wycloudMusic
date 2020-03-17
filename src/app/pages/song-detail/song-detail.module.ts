import { NgModule } from '@angular/core';

import { SongDetailRoutingModule } from './song-detail-routing.module';
import { ShareModule } from 'src/app/share/share.module';
import { SongDetailComponent } from './song-detail.component';

@NgModule({
    declarations: [SongDetailComponent],
    imports: [ShareModule, SongDetailRoutingModule]
})
export class SongDetailModule {}
