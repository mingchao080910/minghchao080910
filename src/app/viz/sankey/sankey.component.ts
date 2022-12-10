import { Component, OnInit, Input } from '@angular/core';
import { VizDataServiceService } from '../viz-data-service.service';

import { SankeyChart, getClassName } from './drawSankey';
import * as d3 from 'd3';
@Component({
  selector: 'app-sankey',
  templateUrl: './sankey.component.html',
  styleUrls: ['./sankey.component.less'],
})
export class SankeyComponent implements OnInit {
  sankey_data!: any;
  isSubTotal: boolean = true;
  sankey_chart: any;
  table_data: any;
  @Input() set data(data: any) {
    if (data) {
      this.sankey_data = data;
      this.table_data = [...data];
      this.data_sevice.get_order().subscribe((orders) => {
        console.log('data==>', orders);

        this.sankey_chart = new SankeyChart(
          'sankeychart',
          this.sankey_data,
          this.isSubTotal,
          orders
        );

        this.sankey_chart.path.on('click', (e: any, d: any) => {
          console.log('d==>', d);
          d3.selectAll('#mypath')
            .transition()
            .duration(500)
            .attr('opacity', 0.1);
          d3.selectAll(`.${getClassName(d.source.id.split('~')[1])}`)
            .transition()
            .duration(500)
            .attr('opacity', 1);

          let source_title = d.source.id.split('~')[0];
          let source_content = d.source.id.split('~')[1];
          let target_title = d.source.id.split('~')[0];
          let target_content = d.source.id.split('~')[1];

          this.table_data = this.sankey_data.filter(
            (item: any) =>
              item[source_title] === source_content ||
              item[target_title] === target_content
          );
        });


      });
    }
  }

  constructor(private data_sevice: VizDataServiceService) {}

  ngOnInit(): void {}

  clear_table() {
    d3.selectAll('#mypath').transition().duration(500).attr('opacity', 1);
    this.table_data = this.sankey_data;
  }
}
