import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { FiltersComponent } from './filters/filters.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilterComponent } from './filter/filter.component';
@NgModule({
  declarations: [FiltersComponent, FilterComponent],
  imports: [
    CommonModule,
    MatRadioModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  exports: [FiltersComponent, CommonModule, FormsModule],
})
export class ShareModule {}
