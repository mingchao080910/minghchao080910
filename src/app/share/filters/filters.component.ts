import { Component, OnInit,Output,EventEmitter } from '@angular/core';

import * as d3 from 'd3';
import { VizDataServiceService } from 'src/app/viz/viz-data-service.service';
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.less'],
})
export class FiltersComponent implements OnInit {

  data: any[] = [];
  contents: any[] = [];
  fields: string[] = [
    'Haptic Sensations',
    'Correlated User Manipulation',
    'Stimulus',
    'Interfacing method',
    'Ground method',
    'Actuating mechanism',
    'Simple to complex mechanism',
  ];
  @Output() filtersChange=new EventEmitter<any>();
  constructor(private data_service: VizDataServiceService) {}

  ngOnInit(): void {
    // formgroup

    this.data_service.get_data().subscribe((data) => {
      console.log('data==>', data);
      this.data = data;
      this.contents = this.fields.map((d) => {
        return { key: d, values: this.get_distinct_arr(data, d) };
      });
    });
  }

  get_distinct_arr(data: any, column: string): string[] {
    let arrs: string[] = d3
      .groups(data, (d: any) => d[column])
      .map((d: any) => {
        return d[0];
      });

    return [...new Set(arrs)];
  }

  filter_change(e: any) {
    console.log('e==>', e);
    // 输出所有的变化
    this.filtersChange.emit(e)
  }
}
