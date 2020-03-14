import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeResolveService } from './home-resolve/home-resolve.service';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        resolve: {
            homeDatas: HomeResolveService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [HomeResolveService]
})
export class HomeRoutingModule {}
