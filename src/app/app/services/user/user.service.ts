import {Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service'

@Injectable({
	providedIn: 'root'
})

export class UserService {
	
	base_url;

	constructor( @Inject(LOCAL_STORAGE) private storage: StorageService, private http: HttpClient ) { 
		this.base_url = 'http://127.0.0.1:9091';
	}

	setSession(sessid){
		this.storage.set('SESSID', sessid);
	}
	getSession(){
		return this.storage.get('SESSID');
	}
	clearSession(){
		this.storage.set('SESSID', '');		
	}

	accountLogin(email_id,password){
		let self= this;
		return new Promise((resolve,reject)=>{
			self.http.post(self.base_url + '/accounts/login',{email_id:email_id,password:password}).subscribe((data)=>{
				self.setSession(data.sessid);
				resolve({status:'success'})
			},(err: HttpErrorResponse)=>{
				if(err.error instanceof Error){
					reject();
				}else{
					console.log(err);
					reject(err);
				}
			})
		})
	}

	getUserList(){
		let self= this;
		return new Promise((resolve,reject)=>{
			let session_id = self.getSession();
			let headers = new HttpHeaders().set('Content-Type', 'application/json').set('auth-token', session_id)
			self.http.get(self.base_url + '/users/list', {headers: headers}).subscribe((data)=>{
				resolve(data)
			},(err : HttpErrorResponse)=>{
				if(err.error instanceof Error){
					reject();
				}else{
					console.log(err);
					reject(err);
				}
			})
		})
	}

}
