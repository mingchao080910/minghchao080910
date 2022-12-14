import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VizDataServiceService } from 'src/app/viz/viz-data-service.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
})
export class FilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();
  fb_group!: FormGroup;
  item_list!: string[];
  @Input() title!: string;
  @Input() set list(arr: string[]) {
    console.log('contents==>', arr);

    this.data_service.get_order().subscribe((orders) => {
      arr.sort((a: any, b: any) =>
        orders.findIndex((v) => v === a) > orders.findIndex((v) => v === b)
          ? 1
          : -1
      );
      this.item_list = arr;
      if (arr.length > 0) {
        let obj = {};
        arr.forEach((d: string) => {
          Object.assign(obj, { [d]: false });
        });

        this.fb_group = this.fb.group(obj);
      }
    });
  }

  constructor(
    private fb: FormBuilder,
    private data_service: VizDataServiceService
  ) {}

  ngOnInit(): void {}

  filter_change() {
    //if all false

    if (this.check_if_all_false(this.fb_group.value)) {
      let all_true_values = this.get_all_true_form_value();
      this.filterChange.emit({
        key: this.title,
        values: all_true_values,
        is_all: true,
      });
    } else {
      this.filterChange.emit({
        key: this.title,
        values: this.fb_group.value,
        is_all: false,
      });
    }
  }

  select_all() {
    let values = this.fb_group.value;
    Object.keys(values).forEach((d) => {
      this.fb_group.patchValue({ [d]: true });
    });
    this.filterChange.emit({
      key: this.title,
      values: this.fb_group.value,
      is_all: true,
    });
  }

  clear_all() {
    let values = this.fb_group.value;

    Object.keys(values).forEach((d) => {
      this.fb_group.patchValue({ [d]: false });
    });

    let all_true_values = this.get_all_true_form_value();
    this.filterChange.emit({
      key: this.title,
      values: all_true_values,
      is_all: true,
    });
  }

  get_all_true_form_value() {
    let all_true_values = {};
    Object.entries(this.fb_group.value).map((d) => {
      Object.assign(all_true_values, { [d[0]]: true });
    });

    return all_true_values;
  }

  check_if_all_false(obj: any) {
    return !Object.entries(obj).reduce((pre: any, cur: any) => {
      return pre || cur[1];
    }, false);
  }
}
