import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import dxDataGrid from 'devextreme/ui/data_grid';
import fields from '../fields';
export class SankeyChart {
  data: any;
  id: string;
  nodes: any;
  links: any;
  margin: any;
  innerW!: number;
  innerH!: number;
  svg: any;
  color: any;
  colors_arr: any;
  color_map: any;
  orders: any;
  columns: string[] = [
    'Haptic Sensations',
    'Correlated User Manipulation',
    'Stimulus',
    'Interfacing method',
    'Ground method',
    'Actuating mechanism',
    'Simple to complex mechanism',
  ];
  link: any;
  path:any;
  isSubTotal: boolean;
  constructor(id: string, data: any, isSubTotal: boolean, orders: any) {
    this.data = data;
    this.orders = orders;
    this.id = id;
    this.isSubTotal = isSubTotal;
    this.init_svg();
    this.get_node_links();
    this.render_scale();
    this.generate_sankey();
  }
  // get_node_links
  get_node_links() {
    this.nodes = this.columns
      .map((d: string) => {
        return this.get_indity_arr(this.data, d);
      })
      .flat(Infinity);

    this.nodes = [...new Set(this.nodes)];

    this.nodes = this.nodes.map((d: any) => {
      return { id: d };
    });
    this.nodes = this.nodes.filter((d: any) => d.id && d.id !== ' ');

    const get_links = (f1: string, f2: string) => {
      return this.data.map((d: any) => {
        return {
          source: f1 + '~' + d[f1],
          target: f2 + '~' + d[f2],
          value: 1,
        };
      });
    };

    this.links = [
      ...get_links('Haptic Sensations', 'Correlated User Manipulation'),
      ...get_links('Correlated User Manipulation', 'Stimulus'),
      ...get_links('Stimulus', 'Interfacing method'),
      ...get_links('Interfacing method', 'Ground method'),
      ...get_links('Ground method', 'Actuating mechanism'),
      ...get_links('Actuating mechanism', 'Simple to complex mechanism'),
    ];
    this.links = this.links.filter((d: any) => d.source && d.source !== ' ');
    this.links = this.links.filter((d: any) => d.target && d.target !== ' ');

    // 汇总线条的数据
    if (this.isSubTotal) {
      this.flatRollupLinks();
    }
  }

  flatRollupLinks() {
    this.links = d3.flatRollup(
      this.links,
      (d: any) => d.length,
      (d: any) => d.source,
      (d: any) => d.target
    );

    this.links = this.links.map((d: any) => {
      return {
        source: d[0],
        target: d[1],
        value: d[2],
      };
    });
  }
  get_indity_arr(data: any, column: string): string[] {
    let arrs: string[] = d3
      .groups(data, (d: any) => d[column])
      .map((d: any) => {
        return column + '~' + d[0];
      });
    arrs.sort((a: any, b: any) => this.sort_nodes(a, b));
    return [...new Set(arrs)];
  }
  // generate_data
  generate_sankey() {
    // debugger;
    let sankey = () => {
      const sankey = d3Sankey
        .sankey()
        .nodeId((d: any) => d.id)
        .nodeWidth(15)
        .nodePadding(2)
        .extent([
          [this.margin.left, this.margin.top],
          [this.innerW - 1, this.innerH - 5],
        ])
        .nodeSort((a: any, b: any) => this.sort_nodes(a.id, b.id));

      return ({ nodes, links }: any) =>
        sankey({
          nodes: nodes.map((d: any) => Object.assign({}, d)),
          links: links.map((d: any) => Object.assign({}, d)),
        });
    };

    // this.nodes.sort((a: any, b: any) => {
    //   return this.orders.findIndex((v: any) => v === a.id.split('~')[1]) >
    //     this.orders.findIndex((v: any) => v === b.id.split('~')[1])
    //     ? 1
    //     : -1;
    // });
    // this.links.sort((a: any, b: any) => {
    //   return this.orders.findIndex(
    //     (v: any) => v === a.source.split('~')[1]
    //   ) > this.orders.findIndex((v: any) => v === b.source.split('~')[1])
    //     ? 1
    //     : -1;
    // });

    const { nodes, links } = sankey()({ nodes: this.nodes, links: this.links });

    this.render({ nodes, links });
  }
  sort_nodes(a: any, b: any) {
    let order =
      this.orders.findIndex((v: any) => v === a.split('~')[1]) >
      this.orders.findIndex((v: any) => v === b.split('~')[1])
        ? 1
        : -1;
    return order;
  }
  render_scale() {
    this.colors_arr = [
      d3.interpolateBlues,
      d3.interpolateBuGn,
      d3.interpolatePuRd,
      d3.interpolateBrBG,
      d3.interpolatePuRd,
      d3.interpolatePiYG,
      d3.interpolateReds,
    ];

    // this.color = d3.scaleOrdinal().domain(this.nodes).range(d3.schemeGreens[9]);

    let color_map = new Map();
    fields.forEach((d: any, i: number) => {
      let domain = this.get_indity_arr(this.data, d);
      console.log('domain==>', domain);
      color_map.set(
        d,
        d3
          .scaleOrdinal()
          .domain(domain)
          .range(d3.quantize(this.colors_arr[i], 20))
      );
    });

    this.color_map = color_map;
  }
  // draw()

  render({ nodes, links }: any) {
    /*********************t添加桑吉图的横条**************************/
    /*****目前数据不足****/
    let svg = this.svg;

    const add_rect = () => {
      svg
        .append('g')
        .attr('stroke', '#000')
        .selectAll('rect')
        .data(nodes)
        .join('rect')
        .attr('x', (d: any) => d.x0)
        .attr('y', (d: any) => d.y0)
        .attr('height', (d: any) => d.y1 - d.y0)
        .attr('width', (d: any) => d.x1 - d.x0)
        .attr('fill', (d: any) => this.color_map.get(d.id.split('~')[0])(d.id))
        .append('title')
        .text((d: any) => `${d.id}`);
    };

    /*********************添加桑吉图的线条**************************/
    /*****label****/
    const add_path = () => {
      const link = svg
        .append('g')
        .attr('fill', 'none')
        .attr('stroke-opacity', 0.5)
        .selectAll('g')
        .data(links)
        .join('g')
        .attr('fill', 'none')
        .style('mix-blend-mode', 'multiply');

      link
        .append('path')
        .attr('class', (d: any) => {
          return this.getClassNames(d);
        })
        .attr('id', 'mypath')
        .attr('d', d3Sankey.sankeyLinkHorizontal())
        .attr('stroke', (d: any) =>
          this.color_map.get(d.source.id.split('~')[0])(d.source.id)
        )
        .attr('stroke-width', (d: any) => Math.max(1, d.width));
      this.path = link;
      // .on('mouseout', () => {
      //   d3.selectAll('#mypath').attr('opacity', 1);
      // });
      link.append('title').text((d: any) => `${d.source.id} → ${d.target.id}}`);
    };

    /*********************添加桑吉图的文本**************************/
    /*****label****/
    const add_text = () => {
      let text_g = svg
        .append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 7)
        .attr('fill', '#f58518');
      text_g
        .selectAll('text')
        .data(nodes)
        .join('text')
        .attr('x', (d: any) => (d.x0 < this.innerW / 2 ? d.x1 + 6 : d.x0 - 6))
        .attr('y', (d: any) => (d.y1 + d.y0) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', (d: any) =>
          d.x0 < this.innerW / 2 ? 'start' : 'end'
        )
        .text((d: any) => d.id.split('~')[1]);
    };

    add_rect();
    add_path();
    add_text();
  }

  init_svg() {
    const div: any = d3.select(`#${this.id}`);
    div.selectAll('*').remove();
    const width = div?.node()?.getBoundingClientRect().width || 500;
    const height = div?.node()?.getBoundingClientRect().height || 500;
    this.margin = { left: 20, right: 20, top: 50, bottom: 20 };
    this.innerW = width - this.margin.left - this.margin.right;
    this.innerH = height - this.margin.top - this.margin.bottom;
    this.svg = div.append('svg').attr('width', width).attr('height', height);
  }

  getClassNames(d: any) {
    let data = this.data.filter((v: any) => {
      return (
        v[d.source.id.split('~')[0]] === d.source.id.split('~')[1] &&
        v[d.target.id.split('~')[0]] === d.target.id.split('~')[1]
      );
    });
    return [
      ...new Set(
        data
          .map((v: any) => {
            return this.columns.map((k: any) => getClassName(v[k]));
          })
          .flat(Infinity)
      ),
    ].join(' ');
  }
}

export function getClassName(str: string) {
  return str.match(/[a-zA-Z]/g)?.join('');
}
