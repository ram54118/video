import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drone-live',
  templateUrl: './drone-live.component.html',
  styleUrls: ['./drone-live.component.scss']
})
export class DroneLiveComponent implements OnInit {
  public droneLiveUrl: string;
  constructor() { }
  ngOnInit() {
    this.droneLiveUrl = '';
  }

}
