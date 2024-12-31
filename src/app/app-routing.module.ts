import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule)
    },
    { path: '**', redirectTo: '/' },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
