import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

declare const MediaRecorder: any;
@Component({
  selector: 'app-webcam-live',
  templateUrl: './webcam-live.component.html',
  styleUrls: ['./webcam-live.component.scss']
})
export class WebCamLiveComponent implements OnInit {

  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild("canvas", { static: true }) public canvas: ElementRef;
  public captures: any[] = [];
  constraints = {
    video: true,
    audio: true
  };
  private recordedBlobs = [];
  private currentStream;
  private mediaRecorder;
  public recordingStarted = false;
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.initCamera();
  }
  tabChanged(event) {
    if (event.index === 0) {
      this.initCamera();
    }
  }
  private initCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(stream => this.attachVideo(stream)).catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }
  private attachVideo(stream) {
    this.currentStream = stream;
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
  }

  private handleError(error) {
    console.log('Error: ', error);
  }

  startRecording() {
    this.recordingStarted = true;
    let options = { mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000 };
    try {
      this.mediaRecorder = new MediaRecorder(this.currentStream, options);
    } catch (e0) {
      console.log('Unable to create MediaRecorder with options Object: ', options, e0);
      try {
        options = { mimeType: 'video/webm;codecs=vp8', bitsPerSecond: 100000 };
        this.mediaRecorder = new MediaRecorder(this.currentStream, options);
      } catch (e1) {
        console.log('Unable to create MediaRecorder with options Object: ', options, e1);
        try {
          this.mediaRecorder = new MediaRecorder(this.currentStream, { mimeType: 'video/mp4' });
        } catch (e2) {
          alert('MediaRecorder is not supported by this browser.');
          console.error('Exception while creating MediaRecorder:', e2);
          return;
        }
      }
    }
    this.mediaRecorder.onstop = (event) => {
      console.log('stop', event.data);
    };
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedBlobs.push(event.data);
      }
    };
    this.mediaRecorder.start(10); // collect 10ms of data
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.mediaRecorder = null;
    this.recordingStarted = false;
  }

  public capturePhoto() {
    this.canvas.nativeElement.getContext("2d").drawImage(this.videoElement.nativeElement, 0, 0, 640, 480);
    this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
  }
}
