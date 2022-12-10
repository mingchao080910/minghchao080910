import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VizComponent } from './viz.component';
const routes: Routes = [
  {
    path: '',
    component: VizComponent,
    // children: [
    //   { path: 'sankey', component: SankeyComponent },
    //   { path: 'parallel', component: ParallelComponent },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VizRoutingModule {}
