import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
    this.item_list = arr;
    if (arr.length > 0) {
      let obj = {};
      arr.forEach((d: string) => {
        Object.assign(obj, { [d]: true });
      });

      this.fb_group = this.fb.group(obj);
    }
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  filter_change() {
    this.filterChange.emit({ key: this.title, values:this.fb_group.value });
  }
}
