import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import { StationService } from '../../services/station/station.service';
import { UserService } from '../../services/user/user.service';


@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	
	@Output() logged_in = new EventEmitter<boolean>();
	
	constructor(private user : UserService) {}

	loginUser(value){
		console.log('Login User > ', value);
		let self = this;
		this.user.accountLogin(value.email_id, value.password).then((success)=>{
			self.logged_in.emit(true);
		}).catch((err)=>{
			console.log(err);
		});
	}
	
	ngOnInit() {}
}
