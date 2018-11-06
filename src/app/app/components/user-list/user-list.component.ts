import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import { StationService } from '../../services/station/station.service';
import { UserService } from '../../services/user/user.service';


@Component({
	selector: 'user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
	
	@Output() logged_in = new EventEmitter<boolean>();
	
	base_url;
	users_list;
	selected_user;
	experties_list;
	experience_lvl_list;

	constructor(private user : UserService) {

	}

	getUserList(){
		let self = this;
		this.user.getUserList().then((data)=>{
			self.users_list = data.users;
			self.experience_lvl_list = data.experties_level;
			self.experties_list = data.experties;
		}).catch((err)=>{
			console.log(err);
		})
	}
	
	ngOnInit() {
		this.base_url = this.user.base_url;
		this.getUserList()
	}
}
