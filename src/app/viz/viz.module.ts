import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { VizComponent } from './viz.component';
import { MatTabsModule } from '@angular/material/tabs';
import { VizRoutingModule } from './viz-routing.modules';
import { MatRadioModule } from '@angular/material/radio';
import { ListComponent } from './list/list.component';
import { DxDataGridModule } from 'devextreme-angular';
import { SankeyComponent } from './sankey/sankey.component';
import { ParallelComponent } from './parallel/parallel.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ShareModule } from '../share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    VizRoutingModule,
    MatRadioModule,
    DxDataGridModule,
    ShareModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [
    VizComponent,

    ListComponent,
    SankeyComponent,
    ParallelComponent,
  ],
  exports: [VizComponent, ListComponent, SankeyComponent, ParallelComponent],
})
export class VizModule {}
