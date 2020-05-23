/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-05-23 17:14:46
 */

import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { PlayerReducer } from './reducers/player.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { MemberReducer } from './reducers/member.reducer';

@NgModule({
    declarations: [],
    imports: [
        StoreModule.forRoot(
            { player: PlayerReducer, member: MemberReducer },
            {
                runtimeChecks: {
                    strictActionImmutability: true,
                    strictActionSerializability: true,
                    strictStateImmutability: true,
                    strictStateSerializability: true,
                },
            }
        ),
        StoreDevtoolsModule.instrument({
            // 最多纪录20条state
            maxAge: 20,
            // 生产环境下只打印日志
            logOnly: environment.production,
        }),
    ],
})
export class AppStoreModule {}
