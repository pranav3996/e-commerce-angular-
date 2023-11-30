import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'e-commerce';
 
  constructor(private router: Router) {}
  // Check if the current page is the login or signup page
  isLoginPage() : boolean{
    return this.router.url === '/login' || this.router.url === '' || this.router.url==='/signup'

  }
 
  ngOnInit(): void {

  }
}
