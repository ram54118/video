import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class WatcherService {
  constructor(private socket: Socket) {}

  establishConnection(videoElement: HTMLVideoElement) {
    let peerConnection;
    const config = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        // {
        //   "urls": "turn:TURN_IP?transport=tcp",
        //   "username": "TURN_USERNAME",
        //   "credential": "TURN_CREDENTIALS"
        // }
      ],
    };

    this.socket.on('offer', (id, description) => {
      peerConnection = new RTCPeerConnection(config);
      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          this.socket.emit('answer', id, peerConnection.localDescription);
        });
      peerConnection.ontrack = (event) => {
        videoElement.srcObject = event.streams[0];
      };
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('candidate', id, event.candidate);
        }
      };
    });

    this.socket.on('candidate', (id, candidate) => {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) => console.error(e));
    });

    this.socket.on('connect', () => {
      this.socket.emit('watcher');
    });

    this.socket.on('broadcaster', () => {
      this.socket.emit('watcher');
    });
  }
}
