import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { PlayerReducer } from './reducers/player.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';



@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot({ player: PlayerReducer }, {
      runtimeChecks: {
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictStateImmutability: true,
        strictStateSerializability: true
      }
    }),
    StoreDevtoolsModule.instrument({
      // 最多纪录20条state
      maxAge: 20,
      // 生产环境下只打印日志
      logOnly: environment.production,

    })
  ]
})
export class AppStoreModule { }
