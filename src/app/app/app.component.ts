import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn;
  
  constructor(private user : UserService){
    this.isLoggedIn = false;
  }

  updateStatus(condition){
    this.isLoggedIn = condition;
  }

  ngOnInit() {
    let session = this.user.getSession();
    if(session && session.length){
      this.isLoggedIn = true;
    }
  }  

}
