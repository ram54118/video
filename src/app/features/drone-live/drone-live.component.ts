import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as data from './../../../assets/configuration/config.json';
import videojs from 'video.js';
import * as Hls from 'hls.js';
import * as tf from '@tensorflow/tfjs';
import * as cocoSSD from '@tensorflow-models/coco-ssd';
@Component({
  selector: 'app-drone-live',
  templateUrl: './drone-live.component.html',
  styleUrls: ['./drone-live.component.scss']
})
export class DroneLiveComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("droneVideo", { static: true }) public droneVideoElem: ElementRef;
  private liveDetectionVideoElem: HTMLVideoElement;
  public droneLiveUrl: string;
  private player;
  constructor() { }
  ngOnInit() {
    const liveurls = (data as any).default;
    console.log('liveurls', liveurls);
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

  tabChanged(event) {
    if (event.index === 0) {
      // this.initCamera();
    } else {
      this.webcam_init();
      
    }
  }

  webcam_init() {
    const LIVE_STREAM_URL =
      "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8";
    this.liveDetectionVideoElem = <HTMLVideoElement>document.getElementById("liveDetectionVideo");
    this.liveDetectionVideoElem.addEventListener("loadeddata", () => {
      console.log('video playing');
      this.predictWithCocoModel();
    });

    if (Hls.isSupported()) {
      const config = { liveDurationInfinity: true };
      const hls = new Hls(config);
      hls.loadSource(LIVE_STREAM_URL);
      hls.attachMedia(this.liveDetectionVideoElem);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        this.liveDetectionVideoElem.play();
      });
    }
  }
  public async predictWithCocoModel() {
    const model = await tf.loadLayersModel('./../assets/model_web/model.json');
    
    this.detectFrame(this.liveDetectionVideoElem, model);
    console.log('model loaded');
  }
  detectFrame = (video, model) => {
    console.log('model', model);
    model.detect(video).then(predictions => {
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  }

  renderPredictions = predictions => {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas-live-detection");

    const ctx = canvas.getContext("2d");

    canvas.width = 640;
    canvas.height = 480;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.drawImage(this.liveDetectionVideoElem, 0, 0, 640, 480);

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });
  };

}
