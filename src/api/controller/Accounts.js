import express from 'express';
import Controller from './Controller';
import moment from 'moment-timezone';
import crypto from 'crypto';


export default class Account extends Controller{
	constructor(){
		super();
	}

	async accountLogin(req,res){
		let body = req.body;
		console.log('Body', body);
		if(body.email_id && body.password && body.email_id != '' && body.password != ''){
			try{
				
				let user_details = await super.queryDb('SELECT user_id, user_email_id, user_password, user_is_admin FROM user_details WHERE user_email_id = ?',[body.email_id]);

				console.log('user_details >', user_details);
				
				
				if(user_details.length){
					let user = user_details[0];

					if(user.user_is_admin == 1){
						if(user.user_password == body.password){

							let sessid;
							let found_sess = false;
							while(!found_sess){
								sessid = crypto.randomBytes(16).toString("hex");
								console.log('sessid > ' , sessid);
								let doExist = await super.queryDb('SELECT * FROM user_session WHERE session_id = ?',[sessid]);
								console.log('doExist >', doExist);
								
								if(doExist.length == 0){

									let isInserted = await super.queryDb('INSERT INTO user_session (session_id, user_id, session_login_time, session_logout_time, session_login_from) VALUES (?,?,?,?,?)',[
										sessid,
										user.user_id,
										moment.tz('Asia/Kolkata').format('X'),
										null,
										req.headers['user-agent']
									]);
									console.log(isInserted);
									found_sess = true;
								}
							}


							res.json({
								sessid: sessid,
								status: 'success'
							});
							// res.json({
							// 	status: 'success'
							// });
						}else{
							res.status(401).json({
								status: 'failure',
								message: 'Email ID or Password is wrong'
							});
						}						
					}else{
						res.status(401).json({
							status: 'failure',
							message: 'Email ID or Password is wrong'
						});
					}
				}else{
					res.status(404).json({
						status: 'failure',
						message: 'No such account exists'
					});
				}

			}catch(err){
				res.status(500).json({
					status: 'failure',
					message: 'Something went wrong',
					error: err.message
				});
			}
		}else{
			res.status(400).json({
				status:'failure',
				message: 'Please provide email id and password'
			});
		}
	}

}