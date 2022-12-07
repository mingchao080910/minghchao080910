import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';

export class Parallel {
  data: any;
  id: string;
  nodes: any;
  links: any;
  margin: any;
  innerW!: number;
  innerH!: number;
  svg: any;
  color: any;
  fileds: any;
  y_scales!: Map<any, any>;
  xScale: any;
  color_scale: any;
  size: any;
  chart_area: any;
  years: any;
  orders: any;
  constructor(id: string, data: any, fileds: string[], orders: any) {
    this.data = data;
    this.id = id;
    this.fileds = fileds;
    this.orders = orders;
    this.set_svg();

    this.set_scales();
    this.set_x_g();
    this.set_lines();
    this.set_circles();
    this.add_legend();
  }

  set_x_g() {
    this.fileds.forEach((d: any) => {
      let g = this.chart_area
        .append('g')
        .attr('transform', `translate(${this.xScale(d)},${0})`);

      let yscale = this.y_scales.get(d);

      let axis = d3.axisLeft(yscale);
      g.call(axis);
    });
  }

  get_distinct_arr(column: string): string[] {
    let { data } = this;
    let arrs: string[] = d3
      .groups(data, (d: any) => d[column])
      .map((d: any) => {
        return d[0];
      });
    arrs.sort((a: any, b: any) => this.sort_nodes(a, b));
    return [...new Set(arrs)];
  }

  set_scales() {
    // this.color = d3.scaleOrdinal().domain(this.nodes).range(d3.schemeTableau10);
    let y_scales = new Map();
    this.fileds.forEach((d: any) => {
      let domain: string[] = this.get_distinct_arr(d);
      y_scales.set(d, d3.scaleBand().domain(domain).range([this.innerH, 0]));
    });

    this.y_scales = y_scales;
    this.xScale = d3
      .scaleBand()
      .domain(this.fileds)
      .range([0, this.innerW * 1.1]);
    this.years = this.get_distinct_arr('Year');
    this.years.sort();
    this.color_scale = d3.scaleOrdinal(d3.schemeTableau10).domain(this.years);
  }

  get_path() {
    let get_paths = (row: any) => {
      let path_arr = this.fileds.map((field: any) => {
        return {
          x: this.xScale(field),
          y: this.y_scales.get(field)(row[field]),
        };
      });
      let path = d3
        .line()
        .x((d: any) => d.x)
        .y((d: any) => d.y);
      // .curve(d3.curveBasis);
      let path_d = path(path_arr);
      return path_d;
    };
    return get_paths;
  }

  set_lines() {
    let get_paths = this.get_path();
    let path = this.chart_area
      .selectAll('.mypath')
      .data(this.data)
      .join('path')
      .attr('class', (d: any) => `mypath id${d.ID}`);
    path
      .attr('d', get_paths)
      .attr('fill', 'none')
      .attr('stroke', (d: any) => this.color_scale(d.Year))
      .attr('stroke-width', 3);

    path
      .on('mousemove', (e: any, d: any) => {
        d3.selectAll('.mypath')
          .transition()
          .duration(500)
          .attr('opacity', 0.02);
        d3.select(`.id${d.ID}`).transition().duration(500).attr('opacity', 1);
        let html = () => ` <section>
          <p><strong>ID:${d['ID']}</strong></p>
          <p><strong>Year:${d['Year']}</strong></p>
          <p><strong>web:${d['web']}</strong></p>
          <p><strong>Meeting name:${d['Meeting name']}</strong></p>
        </section> `;
        this.tips_show(e, d, html);
      })
      .on('mouseout', () => {
        d3.selectAll('.mypath').attr('opacity', 1);
        this.tips_hide();
      });
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

  set_circles() {
    this.fileds.map((d: string) => {
      let circle = this.chart_area
        .selectAll(`.${getClassName(d)}`)
        .data(this.get_distinct_arr(d))
        .join('circle')
        .attr('class', getClassName(d));

      let data = (row: any) => this.data.filter((v: any) => v[d] === row);
      let size = d3.scaleLinear().range([2, 20]).domain([0, this.data.length]);

      circle
        .attr('cx', this.xScale(d))
        .attr('cy', (v: any) => this.y_scales.get(d)(v))
        .attr('r', (row: any) => size(data(row).length))
        .attr('fill', 'purple');
    });
  }

  set_svg() {
    const div: any = d3.select(`#${this.id}`);
    div.selectAll('*').remove();

    const width = div?.node()?.getBoundingClientRect().width;
    const height = div?.node()?.getBoundingClientRect().height;
    this.margin = { left: 120, right: 20, top: 50, bottom: 80 };
    this.innerW = width - this.margin.left - this.margin.right;
    this.innerH = height - this.margin.top - this.margin.bottom;
    this.svg = div.append('svg').attr('width', width).attr('height', height);
    this.chart_area = this.svg
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  add_legend() {
    let x_position = (this.innerW - this.years.length * 80) / 2;
    let rects = this.chart_area
      .selectAll('.legend')
      .data(this.years)
      .join('rect');
    rects
      .attr('x', (d: any, i: number) => i * 80 + x_position)
      .attr('y', this.innerH + 10)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', (d: string) => this.color_scale(d));
    let texts = this.chart_area
      .selectAll('.legendtext')
      .data(this.years)
      .join('text');

    texts
      .attr('x', (d: any, i: number) => i * 80 + 30 + x_position)
      .attr('y', this.innerH + 25)
      .text((d: any) => d);
  }

  sort_nodes(a: any, b: any) {
    let order =
      this.orders.findIndex((v: any) => v === a) >
      this.orders.findIndex((v: any) => v === b)
        ? -1
        : 1;
    return order;
  }
}
function getClassName(str: string) {
  return str.match(/[a-zA-Z]/g)?.join('');
}
