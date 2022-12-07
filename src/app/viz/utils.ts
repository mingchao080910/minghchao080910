import * as d3 from 'd3';
export function get_distinct_arr(data: any, column: string): string[] {
  let arrs: string[] = d3
    .groups(data, (d: any) => d[column])
    .map((d: any) => {
      return d[0];
    });

  return [...new Set(arrs)];
}
