import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import videojs from 'video.js';
@Component({
  selector: 'app-iphone-live',
  templateUrl: './iphone-live.component.html',
  styleUrls: ['./iphone-live.component.scss']
})
export class IphoneLiveComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild("droneVideo", { static: true }) public droneVideoElem: ElementRef;
  public droneLiveUrl: string;
  private player;
  constructor() { }
  ngOnInit() {
    this.droneLiveUrl = 'https://www.youtube.com/watch?v=dwhFIfdjK8A&feature=youtu.be';
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
