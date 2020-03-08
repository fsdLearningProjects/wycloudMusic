import { NgModule, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// 生成令牌
export const API_URL = new InjectionToken('api_url');
export const WINDOW = new InjectionToken('window');



@NgModule({
  declarations: [],
  imports: [

  ],
  providers: [
    // 注入令牌
    { provide: API_URL, useValue: 'http://localhost:3000/' },
    {
      provide: WINDOW,
      useFactory(platformId: Object): Window | Object {
        // 如果是浏览器环境，则返回 window 对象，否则返回一个空对象
        return isPlatformBrowser(platformId) ? window : {};
      },
      deps: [ PLATFORM_ID ]
    }
  ]
})
export class ServicesModule { }
