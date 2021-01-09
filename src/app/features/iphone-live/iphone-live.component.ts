import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {DeviceInfoService} from 'src/app/services/device-info.service';
import {IoService} from 'src/app/services/io.service';
import {WatcherService} from 'src/app/services/watcher.service';
import videojs from 'video.js';
import * as data from './../../../assets/configuration/config.json';

@Component({
  selector: 'app-iphone-live',
  templateUrl: './iphone-live.component.html',
  styleUrls: ['./iphone-live.component.scss'],
  providers: [IoService, WatcherService],
})
export class IphoneLiveComponent extends DeviceInfoService implements OnInit, AfterViewInit, OnDestroy {
  public tabs;
  public iPhoneLiveUrl: string;
  private player;
  public isIphoneDevice: boolean;
  private recordedBlobs = [];
  private currentStream;

  public recordingStarted = false;
  public isLiveVideoLoaded = false;
  constructor(private renderer: Renderer2, private ioService: IoService, private watcherService: WatcherService, private socket: Socket) {
    super();
  }
  ngOnInit() {
   // this.watcherService.emitWatcher();
    if (this.isIOSDevice()) {
      this.tabs = [
        {
          label: 'Start Iphone Streaming',
          value: 'iphoneStream',
        },
      ];
    } else {
      this.tabs = [
        {
          label: 'Live Stream Direct',
          value: 'liveDirectStream',
        },
        {
          label: 'Live Stream RTMP',
          value: 'liveStreamRTMP',
        },
        {
          label: 'Live Object Detection Direct',
          value: 'liveObjectDetection',
        },
        {
          label: 'Live Object Detection RTMP',
          value: 'liveObjectDetectionRTMP',
        },
        {
          label: 'Start Iphone Streaming',
          value: 'iphoneStream',
        },
      ];
    }
    const liveurls = (data as any).default;
    this.iPhoneLiveUrl = liveurls ? liveurls.iPhoneLiveUrl : null;
    // this.initCamera();
    // this.getDirectFeed();
  }
  tabChanged(event) {
    if (this.isIOSDevice()) {
      this.initCamera();
    } else {
      if (event.index === 1) {
        const options = {
          controls: true,
          autoplay: true,
          fluid: false,
          loop: false,
          bigPlayButton: true,
          controlBar: {
            volumePanel: true,
          },
        };
        const videoElem = document.getElementById('live-stream-rtmp-video');
        this.player = videojs(videoElem, options, function onPlayerReady() {
          videojs.log('your player is ready');
        });
      }

      if (event.index === 4) {
        this.initCamera();
      }

      if (event.index === 0) {
        this.getDirectFeed();
      }
    }
  }

  private getDirectFeed() {
    this.socket.fromEvent('broadcaster').subscribe(ev => console.log('ada', ev));
    this.watcherService.establishConnection(document.querySelector('#directFeed'));
  }

  ngAfterViewInit() {
    // if (this.iphoneVideoElem) {
    //   const options = {
    //     controls: true,
    //     autoplay: true,
    //     fluid: false,
    //     loop: false,
    //     bigPlayButton: true,
    //     controlBar: {
    //       volumePanel: true,
    //     },
    //   };
    //   this.player = videojs(this.iphoneVideoElem.nativeElement, options, function onPlayerReady() {
    //     videojs.log('your player is ready');
    //   });
    // }
    // this.initCamera();
  }

  private initCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => this.attachVideo(stream))
        .catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }
  private attachVideo(stream) {
    this.currentStream = stream;
    const liveStreamVideo: HTMLVideoElement = document.querySelector('#iPhoneStreamVideo');
    liveStreamVideo.srcObject = stream;
    this.isLiveVideoLoaded = true;
  }

  private handleError(error) {
    console.log('Error: ', error);
  }

  startRecording() {
    this.recordingStarted = true;
    // let options = { mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000 };
    // try {
    //   this.mediaRecorder = new MediaRecorder(this.currentStream, options);
    // } catch (e0) {
    //   console.log('Unable to create MediaRecorder with options Object: ', options, e0);
    //   try {
    //     options = { mimeType: 'video/webm;codecs=vp8', bitsPerSecond: 100000 };
    //     this.mediaRecorder = new MediaRecorder(this.currentStream, options);
    //   } catch (e1) {
    //     console.log('Unable to create MediaRecorder with options Object: ', options, e1);
    //     try {
    //       this.mediaRecorder = new MediaRecorder(this.currentStream, { mimeType: 'video/mp4' });
    //     } catch (e2) {
    //       alert('MediaRecorder is not supported by this browser.');
    //       console.error('Exception while creating MediaRecorder:', e2);
    //       return;
    //     }
    //   }
    // }
    // this.mediaRecorder.onstop = (event) => {
    //   console.log('stop', event.data);
    // };
    // this.mediaRecorder.ondataavailable = (event) => {
    //   if (event.data && event.data.size > 0) {
    //     this.recordedBlobs.push(event.data);
    //   }
    // };
    // this.mediaRecorder.start(10); // collect 10ms of data
    this.ioService.establishConnection(document.querySelector('#iPhoneStreamVideo'));
    this.ioService.emitBroadcaster();
  }

  stopRecording() {
    this.recordingStarted = false;
    this.ioService.stopConnection();
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
