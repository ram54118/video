import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as data from './../../../assets/configuration/config.json';
import videojs from 'video.js';
@Component({
  selector: 'app-drone-live',
  templateUrl: './drone-live.component.html',
  styleUrls: ['./drone-live.component.scss']
})
export class DroneLiveComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("droneVideo", { static: true }) public droneVideoElem: ElementRef;
  public droneLiveUrl: string;
  private player;
  constructor() { }
  ngOnInit() {
    const liveurls = (data as any).default;
    this.droneLiveUrl = liveurls ? liveurls.droneLiveUrl : null;
  }

  ngAfterViewInit() {
    const options = {
      controls: true,
      autoplay: true,
      fluid: false,
      loop: false,
      bigPlayButton: true,
      controlBar: {
        volumePanel: true
      }
    };
    this.player = videojs(this.droneVideoElem.nativeElement, options, function onPlayerReady() {
      videojs.log('your player is ready');
    })
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }

}
