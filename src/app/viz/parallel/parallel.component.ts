import { Component, OnInit, Input } from '@angular/core';
import { VizDataServiceService } from '../viz-data-service.service';
import { Parallel } from './chart';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-parallel',
  templateUrl: './parallel.component.html',
  styleUrls: ['./parallel.component.less'],
})
export class ParallelComponent implements OnInit {
  fields: string[] = [
    'Haptic Sensations',
    'Correlated User Manipulation',
    'Stimulus',
    'Interfacing method',
    'Ground method',
    'Actuating mechanism',
    'Simple to complex mechanism',
  ];
  filtered_fields: string[] = [...this.fields];
  min_year: number = 2010;
  max_year: number = 2022;
  start_year: number = 2010;
  end_year: number = 2022;
  sankey_data!: any;
  orders: any;
  @Input() set data(data: any) {
    if (data) {
      this.sankey_data = data;
      this.data_service.get_order().subscribe((orders) => {
        this.orders = orders;
        new Parallel('parallel', this.sankey_data, this.fields, orders);
      });
    }
  }

  toppings!: any;
  constructor(
    private _formBuilder: FormBuilder,
    private data_service: VizDataServiceService
  ) {}

  ngOnInit(): void {
    let obj = {};
    this.fields.forEach((d) => {
      Object.assign(obj, { [d]: true });
    });
    this.toppings = this._formBuilder.group(obj);
  }

  fileds_change() {
    let fields = Object.entries(this.toppings.value)
      .filter((v: any) => v[1])
      .map((d: any) => d[0]);
    this.filtered_fields = fields;
    new Parallel('parallel', this.sankey_data, fields, this.orders);
  }

  start_end_year_change(e: any) {
    console.log('e==>', this.end_year, this.start_year);
    let data = this.sankey_data.filter(
      (d: any) => +d.Year >= this.start_year && +d.Year <= this.end_year
    );

    new Parallel('parallel', data, this.filtered_fields, this.orders);
  }
}
