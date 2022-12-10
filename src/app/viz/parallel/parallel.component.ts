import { Component, OnInit, Input } from '@angular/core';
import { VizDataServiceService } from '../viz-data-service.service';
import { Parallel, get_invert_x_dim_by } from './chart';
import { FormBuilder } from '@angular/forms';
import * as d3 from 'd3';

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
  table_data: any;
  orders: any;
  selected_lines: string[] = [];
  parallel: any;
  @Input() set data(data: any) {
    if (data) {
      this.sankey_data = data;
      this.table_data = [...data];
      this.data_service.get_order().subscribe((orders) => {
        this.orders = orders;
        this.parallel = new Parallel(
          'parallel',
          this.sankey_data,
          this.fields,
          orders,
          this.table_data
        );

        this.generate_events();
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
    this.parallel = new Parallel(
      'parallel',
      this.sankey_data,
      fields,
      this.orders,
      this.table_data
    );
    this.generate_events();
  }

  start_end_year_change(e: any) {
    console.log('e==>', this.end_year, this.start_year);
    let data = this.sankey_data.filter(
      (d: any) => +d.Year >= this.start_year && +d.Year <= this.end_year
    );

    this.table_data = [...data];
    this.parallel = new Parallel(
      'parallel',
      data,
      this.filtered_fields,
      this.orders,
      this.table_data
    );
    this.generate_events();
  }

  generate_events() {
    this.parallel.path
      .on('click', (e: any, d: any) => {
        this.lines_on_click(e, d);
      })
      .on('mouseover', (e: any, d: any) => {
        this.lins_on_mouse_over(e, d);
      })
      .on('mouseout', (e: any, d: any) => {
        this.tips_hide();
      });

    // this.parallel.svg.on('click',(e:any,d:any)=>{
    //    console.log("e,d==>",

    //    e.target.nodeName,d)

    // })

    let brushed = (event: any) => {
      let [[x1_position, y1_position], [x2_position, y2_position]] =
        event.selection;

      const get_band_items_by_scale_invert = (
        x: any,
        x1_position: number,
        x2_position: number,
        fileds: string[]
      ) => {
        let x1_field = get_invert_x_dim_by(x, x1_position);
        let x2_field = get_invert_x_dim_by(x, x2_position);

        let x1_index = fileds.findIndex((v) => v === x1_field);
        let x2_index = fileds.findIndex((v) => v === x2_field);
        let arr = fileds.slice(x1_index, x2_index);

        return arr;
      };

      let selected_x_fields_arr = get_band_items_by_scale_invert(
        this.parallel.xScale,
        x1_position,
        x2_position,
        this.filtered_fields
      );

      // console.log('selected_x_fields_arr==>', selected_x_fields_arr);
      let ids = this.sankey_data.filter((v: any) => {
        let ids = [];
        // 所有的相关字段都相等
        selected_x_fields_arr.forEach((item: string) => {
          let y = this.parallel.y_scales.get(item);

          let y_arr = get_band_items_by_scale_invert(
            y,
            y1_position,
            y2_position,
            y.domain()
          );

          let id = this.sankey_data
            .filter((v: any) => y_arr.includes(v[item]))
            .map((d: any) => d.ID)
            .flat(2);
          console.log('id==>', id);

          ids.push(...id);
        });
      });
    };


    // this.parallel.chart_area
    //   .attr('class', 'brush')
    //   .call(d3.brush().on('brush', brushed));
  }

  lines_on_click(e: any, d: any) {
    d3.selectAll('.mypath')
      .transition()
      .duration(500)
      .attr('opacity', (d: any) =>
        this.selected_lines.includes(d.ID) ? 1 : 0.02
      );
    d3.select(`.id${d.ID}`).transition().duration(500).attr('opacity', 1);
    !this.selected_lines.includes(d.ID) && this.selected_lines.push(d.ID);
    this.table_data = this.sankey_data.filter((v: any) =>
      this.selected_lines.includes(v.ID)
    );
  }
  lins_on_mouse_over(e: any, d: any) {
    let html = () => ` <section>
                        <p><strong>ID:${d['ID']}</strong></p>
                        <p><strong>Year:${d['Year']}</strong></p>
                        <p><strong>web:${d['web']}</strong></p>
                        <p><strong>Meeting name:${d['Meeting name']}</strong></p>
                        </section> `;
    this.tips_show(e, d, html);
  }

  tips_show(e: any, d: any, html: any) {
    d3.select('.d3-tip')
      .style('display', 'block')
      .style('position', 'absolute')
      .style('top', `${e.pageY}px`)
      .style('left', `${e.pageX}px`)
      .html(html);
  }
  tips_hide() {
    d3.select('.d3-tip').style('display', 'none');
  }

  clear_table() {
    this.table_data = this.sankey_data;
    this.selected_lines = [];
    d3.selectAll(`.mypath`).transition().duration(500).attr('opacity', 1);
  }
}
