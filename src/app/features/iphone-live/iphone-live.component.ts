import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import videojs from 'video.js';
import * as data from './../../../assets/configuration/config.json';
@Component({
  selector: 'app-iphone-live',
  templateUrl: './iphone-live.component.html',
  styleUrls: ['./iphone-live.component.scss']
})
export class IphoneLiveComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild("iphoneVideo", { static: true }) public iphoneVideoElem: ElementRef;
  public iPhoneLiveUrl: string;
  private player;
  constructor() { }
  ngOnInit() {
    const liveurls = (data as any).default;
    this.iPhoneLiveUrl = liveurls ? liveurls.iPhoneLiveUrl : null;
  }

  ngAfterViewInit(){
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
    this.player = videojs(this.iphoneVideoElem.nativeElement, options, function onPlayerReady() {
      videojs.log('your player is ready');
    })
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }

}
