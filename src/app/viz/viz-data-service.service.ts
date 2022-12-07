import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import * as d3 from 'd3';
@Injectable({
  providedIn: 'root',
})
export class VizDataServiceService {
  filtered_data: any;
  constructor(private http: HttpClient) {}

  get_data() {
    return this.http
      .get('/assets/sankey_data.csv', { responseType: 'text' })
      .pipe(map((data) => d3.csvParse(data)));
  }

  set_filtered_data(data: any) {
    this.filtered_data = data;
  }
  get_filtered_data() {
    return this.filtered_data;
  }
  get_order() {
    return this.http.get('/assets/order.csv', { responseType: 'text' }).pipe(
      map((data) => d3.csvParse(data)),
      map((data) => data.map((d: any) => d.order))
    );
  }
}
