import { Component, OnInit, Input } from '@angular/core';
import { VizDataServiceService } from '../viz-data-service.service';
import * as _ from 'lodash';
import { SankeyChart, getClassName } from './drawSankey';
import * as d3 from 'd3';

@Component({
  selector: 'app-sankey',
  templateUrl: './sankey.component.html',
  styleUrls: ['./sankey.component.less'],
})
export class SankeyComponent implements OnInit {
  sankey_data!: any;
  is_hightlight: boolean = true;
  orders: string[] = [];
  sankey_chart: any;
  table_data: any;
  filter_data: any;
  _filter_conditions: any;
  selected_filters_values = new Map();
  @Input() set filter_conditions(data: any) {
    console.log('filter_conditions==>', data);
    this._filter_conditions = data;
    this.is_hightlight && this.high_light_sankey();
  }
  @Input() set filtered_data(data: any) {
    if (data) {
      this.filter_data = data;
      this.table_data = [...data];
      !this.is_hightlight && this.filter_sankey(this.filter_data);
    }
  }

  @Input() set data(data: any) {
    this.sankey_data = data;
    this.table_data = [...data];
    this.render_sankey();
  }
  constructor(private data_sevice: VizDataServiceService) {}

  ngOnInit(): void {}

  clear_table() {
    d3.selectAll('#mypath').transition().duration(500).attr('opacity', 1);
    this.table_data = this.sankey_data;
  }

  render_sankey() {
    this.data_sevice.get_order().subscribe((orders) => {
      console.log('data==>', orders);

      this.sankey_chart = new SankeyChart(
        'sankeychart',
        this.sankey_data,
        orders
      );
      this.orders = orders;
      this.sankey_chart.path.on('click', (e: any, d: any) => {
        console.log('d==>', d);
        d3.selectAll('#mypath').transition().duration(500).attr('opacity', 0.1);
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

      this.high_light_sankey();
    });
  }

  high_light_sankey() {
    // 循环条件,将所有的选中的条件都高亮

    if (
      this._filter_conditions.is_all ||
      Object.keys(this._filter_conditions).length === 0
    ) {
      d3.selectAll('#mypath').transition().duration(500).attr('opacity', 1);
    } else {
      let conditons = Object.entries(this._filter_conditions.values)
        .filter((d) => d[1])
        .map((d) => d[0]);
      this.selected_filters_values.set(this._filter_conditions.key, conditons);
      console.log('this._filter_conditions==>', this.selected_filters_values);

      d3.selectAll('#mypath').transition().duration(500).attr('opacity', 0.1);
      this.selected_filters_values.forEach((values: any, key: any) => {
        key &&
          values.forEach((d: any) => {
            d3.selectAll(`.${getClassName(d)}`)
              .transition()
              .duration(500)
              .attr('opacity', 1);
          });
      });
    }
  }

  filter_sankey(data: any) {
    this.sankey_chart = new SankeyChart('sankeychart', data, this.orders);
  }

  redraw_sankey() {
    if (this.is_hightlight) {
      this.sankey_chart = new SankeyChart(
        'sankeychart',
        this.sankey_data,
        this.orders
      );
      this.high_light_sankey();
    } else {
      this.sankey_chart = new SankeyChart(
        'sankeychart',
        this.filter_data,
        this.orders
      );
    }
  }
}
