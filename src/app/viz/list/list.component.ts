import { Component, OnInit, Input } from '@angular/core';
import { VizDataServiceService } from '../viz-data-service.service';

import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class ListComponent implements OnInit {
  dataSource!: DataSource; //获取上传的数据
  @Input()
  set data(data:any) {
    this.dataSource = new DataSource({
      store: new ArrayStore({
        key: 'ID',
        data: data
      }),
    });
  }

  constructor() {}

  ngOnInit(): void {}
}
