import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { VizDataServiceService } from './viz-data-service.service';

@Component({
  selector: 'app-viz',
  templateUrl: './viz.component.html',
  styleUrls: ['./viz.component.less'],
})
export class VizComponent implements OnInit {
  data!: any;
  orders!: any;
  data_arr: any;
  filtered_data: any;
  filter_conditions = new Map();
  sankey_filter_conditions = new Map();
  showSankey: boolean = true;
  constructor(private data_service: VizDataServiceService) {}

  ngOnInit(): void {
    this.data_service.get_data().subscribe((sankey_data: any) => {
      this.data_service.get_order().subscribe((orders: any) => {
        this.data = sankey_data;
        this.filtered_data = [...sankey_data];
        this.orders = orders.map((d: any) => d.order);
        //
        console.log('this.orders==>', this.orders);
        this.data_arr = [this.filtered_data, this.orders];
      });
    });
  }

  filters_change(filter_condition: any) {
    // 筛选条件True的项目为数组
    let conditons = Object.entries(filter_condition.values)
      .filter((d) => d[1])
      .map((d) => d[0]);
    // 保存条件
    this.filter_conditions.set(filter_condition.key, conditons);

    this.sankey_filter_conditions = _.cloneDeep(filter_condition);
    // 统一筛选条件
    this.filtered_data = this.data.filter((d: any) => {
      let result = true;
      this.filter_conditions.forEach((value: string[], key: string) => {
        result = result && value.includes(d[key]);
      });
      return result;
    });
  }

  change_chart_show(chart: any) {
    console.log('chart==>', chart);
    if (chart.index === 0) {
      this.showSankey = true;
    } else {
      this.showSankey = false;
    }
  }
}
