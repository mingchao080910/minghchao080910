import { Component, OnInit, Input } from '@angular/core';
import { VizDataServiceService } from '../viz-data-service.service';

import { SankeyChart } from './drawSankey';

@Component({
  selector: 'app-sankey',
  templateUrl: './sankey.component.html',
  styleUrls: ['./sankey.component.less'],
})
export class SankeyComponent implements OnInit {
  sankey_data!: any;
  isSubTotal: boolean = true;
  @Input() set data(data: any) {
    if (data) {
      this.sankey_data = data;
      this.data_sevice.get_order().subscribe((orders) => {
        console.log('data==>', orders);

        new SankeyChart(
          'sankeychart',
          this.sankey_data,
          this.isSubTotal,
          orders
        );
      });
    }
  }

  constructor(private data_sevice: VizDataServiceService) {}

  ngOnInit(): void {}
  ngOnChange(e: any) {
    console.log('e==>', e);
  }
}
