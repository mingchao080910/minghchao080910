import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { MorphologicalComponent } from './morphological/morphological.component';
import { MorphologicalModule } from './morphological/morphological.module';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'viz',
    loadChildren: () => import('./viz/viz.module').then((m) => m.VizModule),

    // component: VizComponent,
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchModule),
  },
  {
    path: 'morphological',
    component: MorphologicalComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), MorphologicalModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
