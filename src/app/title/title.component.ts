import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.less'],
})
export class TitleComponent implements OnInit {
  constructor(private route: Router) {}
  toggle: any = {
    viz: false,
    home: true,
    morphological: false,
    search: false,
    about: false,
  };
  ngOnInit(): void {}

  route_to(url: string) {
    Object.keys(this.toggle).forEach((d: string) => {
      this.toggle[d] = false;
    });
    this.toggle[url.replace('/','')] = true;
    this.route.navigate([url]);
  }
}
