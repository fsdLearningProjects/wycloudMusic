import { NgModule, SkipSelf, Optional } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ShareModule } from '../share/share.module';
import { ServicesModule } from '../services/services.module';
import { PagesModule } from '../pages/pages.module';
import { AppStoreModule } from '../store/app-store.module';




@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ShareModule,
    ServicesModule,
    PagesModule,
    AppStoreModule
  ],
  exports: [
    ShareModule
  ]
})
export class CoreModule {
  // @SkipSelf 查找依赖的时候跳过自身
  // @optional 依赖是可选的
  constructor(@SkipSelf() @Optional() coreModule: CoreModule) {
    if (coreModule) {
      throw new Error('CoreMoudle 只能被 AppModule 引入！');
    }
  }
}
