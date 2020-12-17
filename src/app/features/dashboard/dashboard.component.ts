import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {

  }

  navigateToScreen(url: string) {
    this.router.navigateByUrl(`dashboard/${url}`);
  }
}
