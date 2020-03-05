import { NgModule, InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken('api_url');



@NgModule({
  declarations: [],
  imports: [

  ],
  providers: [
    { provide: API_URL, useValue: 'http://localhost:3000/' }
  ]
})
export class ServicesModule { }
