import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { ShareModule } from '../share/share.module';
@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, ShareModule],
})
export class SearchModule {}
