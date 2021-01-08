import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class IoService {
  constructor(private socket: Socket) {}

  establishConnection(videoElement: HTMLVideoElement) {
    //  this.socket = io.connect(window.location.origin);
    const peerConnections = {};
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
    this.socket.on('answer', (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    this.socket.on('watcher', (id) => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;

      const stream: any = videoElement.srcObject;
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('candidate', id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          this.socket.emit('offer', id, peerConnection.localDescription);
        });
    });

    this.socket.on('candidate', (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    this.socket.on('disconnectPeer', (id) => {
      peerConnections[id].close();
      delete peerConnections[id];
    });
  }

  emitBroadcaster() {
    this.socket.emit('broadcaster');
  }

  stopConnection() {
    this.socket.disconnect();
  }
}
