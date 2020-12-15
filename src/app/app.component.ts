import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public liveStreamUrl: string;
    constructor() {}

    ngOnInit() {
        this.liveStreamUrl = "https://youtu.be/a3ICNMQW7Ok";
    }
   

}
