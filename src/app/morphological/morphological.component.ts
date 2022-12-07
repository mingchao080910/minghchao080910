import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-morphological',
  templateUrl: './morphological.component.html',
  styleUrls: ['./morphological.component.less'],
})
export class MorphologicalComponent implements OnInit {
  titles: string[] = [
    'Haptic Sensations',
    'User Stimulus',
    'Haptic Stimulus',
    'Forms',
    'Source-to-mechanical mechanism',
    'Simple-to-Complex',
    'Actuating mechanisms',
  ];
  titlesObj = new Map();
  constructor() {
    this.titles.forEach((d) => this.titlesObj.set(d, false));
    this.titlesObj.set('Haptic Sensations', true);
  }

  ngOnInit(): void {}

  menu_click(item: any, el: HTMLElement) {
    console.log('item==>', item);
    let position = new Map();
    position.set('Haptic Sensations', [0, 0]);
    position.set('User Stimulus', [0, 600]);
    position.set('Haptic Stimulus', [0, 1280]);
    position.set('Forms', [0, 1800]);
    position.set('Source-to-mechanical mechanism', [0, 2720]);
    position.set('Simple-to-Complex', [0, 1400]);
    position.set('Actuating mechanisms', [0, 1220]);
    this.titlesObj;

    this.titlesObj.forEach((value, key) => this.titlesObj.set(key, false));
    // 跳转到相应的位置
    window.scrollTo(position.get(item)[0], position.get(item)[1]);

    console.log('window.scrollY==>', window.scrollY);
    this.titlesObj.set(item, true);
  }
}
