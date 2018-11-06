import express from 'express';
import Controller from './Controller';
import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';
export default class User extends Controller{
	constructor(){
		super();
	}

	clearFile(file_name){
		try{
			let file_path = path.normalize(path.join('uploads',file_name));
			if(fs.existsSync(file_path)){
				fs.unlink(file_path);
			}
		}catch(err){
			console.log('Error >',err.message);
		}
		
	}

	async getUserList(req,res){
		try{
			let user_list = await super.queryDb('SELECT user_id, user_email_id, user_dp, user_phone_no, user_first_name, user_last_name, user_company_name, experties_name, user_years_of_exp, lvl_name FROM user_details LEFT JOIN experties_list ON user_technical_experties=experties_id LEFT JOIN experiense_lvl_list ON user_experience_level = lvl_id WHERE user_is_active = 1 AND user_is_admin = 0');
			let experiense_lvl_list = await super.queryDb('SELECT lvl_id, lvl_name FROM experiense_lvl_list');
			let experties_list = await super.queryDb('SELECT experties_id, experties_name FROM experties_list');
			// console.log('Base URL >>  ', req.ip+':'+req.port);
			

			res.json({
				users: (user_list).map((user)=>{
					return {
						"id": user.user_id,
						"dp": user.user_dp,
						"first_name": user.user_first_name,
						"last_name": user.user_last_name,
						"email": user.user_email_id,
						"phone_no": user.user_phone_no,
						"company_name": user.user_company_name,
						"experties": user.experties_name,
						"level_of_experties": user.lvl_name,
						"years_of_exp": user.user_years_of_exp
					}
				}),
				experties: (experties_list).map((experties)=>{
					return{
						"id": experties.experties_id,
						"name": experties.experties_name
					}
				}),
				experties_level: (experiense_lvl_list).map((experties_lvl)=>{
					return{
						"id": experties_lvl.lvl_id,
						"name": experties_lvl.lvl_name
					}
				}),
				status: "success"
			});

		}catch(err){
			res.status(500).json({
				status: 'failure',
				message: 'Something went wrong',
				'error': err.message
			});
		}
	}

	async addNewUser(req,res){
		let body = req.body;
		let keys = ['first_name','last_name','email_id','company_name','phone_no','experties','level_of_experties','years_of_experience'];
		let isValid = true;
		keys.map((key)=>{
			if(isValid && (body[key] == null || body[key] == undefined || body[key] == '' )){
				isValid = false;
			}
		});

		if(isValid){
			try{
				
				let isExistUser = await super.queryDb('SELECT user_email_id FROM user_details WHERE user_email_id = ?', [body.email_id]);
				let isExistExperties = await super.queryDb('SELECT * FROM experties_list WHERE experties_id = ? ',[body.experties]);
				let isExistExpertiesLvl = await super.queryDb('SELECT * FROM experiense_lvl_list WHERE lvl_id = ? ', [body.level_of_experties]);
				if(!isExistUser.length && isExistExperties.length && isExistExpertiesLvl.length){
					
					let user_dp = '';
					if(req.filename){
						user_dp = ('uploads/'+req.filename)
					}else{
						user_dp = null;						
					}

					let isInserted = await super.queryDb('INSERT INTO user_details (user_email_id, user_dp, user_phone_no, user_first_name, user_last_name, user_company_name, user_technical_experties, user_years_of_exp, user_experience_level, user_is_admin, user_is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[
						body.email_id,
						user_dp,
						body.phone_no,
						body.first_name,
						body.last_name,
						body.company_name,
						body.experties,
						body.years_of_experience,
						body.level_of_experties,
						0,
						1
					]);

					if(isInserted){
						res.json({
							status:'success',
							message:'New User Added'
						})
					}else{
						if(req.filename){
							this.clearFile(req.filename)
						}
						res.status(500).json({
							status: 'failure',
							message: 'Something went wrong'
						});
					}

				}else if(isExistUser.length){
					if(req.filename){
						this.clearFile(req.filename)
					}
					res.status(400).json({
						status: 'failure',
						message: 'User already exists'
					});
				}else{
					if(req.filename){
						this.clearFile(req.filename)
					}
					res.status(400).json({
						status: 'failure',
						message: 'Experties or Experties Level is not correct'
					});
				}
			}catch(err){
				if(req.filename){
					this.clearFile(req.filename)
				}
				res.status(500).json({
					status: 'failure',
					message: 'Something went wrong',
					'error': err.message
				});
			}
		}else{
			if(req.filename){
				this.clearFile(req.filename)
			}
			res.status(400).json({
				status: 'failure',
				message: 'Please fill require fields'
			});
		}
		// res.send('Its working bro');        
	}

	async editUserDetails(req,res){
		let body = req.body, user_id = req.params.user_id;
		let keys = ['first_name','last_name','email_id','company_name','phone_no','experties','level_of_experties','years_of_experience'];
		let isValid = true;
		keys.map((key)=>{
			if(isValid && (body[key] == null || body[key] == undefined || body[key] == '' )){
				isValid = false;
			}
		});

		if(isValid){
			try{
				
				let isExistUser = await super.queryDb('SELECT user_email_id FROM user_details WHERE user_id = ?', [user_id]);
				let isExistExperties = await super.queryDb('SELECT * FROM experties_list WHERE experties_id = ? ',[body.experties]);
				let isExistExpertiesLvl = await super.queryDb('SELECT * FROM experiense_lvl_list WHERE lvl_id = ? ', [body.level_of_experties]);
				
				if(isExistUser.length && isExistExperties.length && isExistExpertiesLvl.length){
					
					let user_dp = '';
					if(req.filename){
						user_dp = ('uploads/'+req.filename)
					}else{
						user_dp = body.dp;						
					}

					let isUpdated = await super.queryDb('UPDATE user_details SET user_email_id = ?, user_dp = ?, user_phone_no = ?, user_first_name = ?, user_last_name = ?, user_company_name = ?, user_technical_experties = ?, user_years_of_exp = ?, user_experience_level = ? WHERE user_id = ?',[
						body.email_id,
						user_dp,
						body.phone_no,
						body.first_name,
						body.last_name,
						body.company_name,
						body.experties,
						body.years_of_experience,
						body.level_of_experties,
						user_id
					]);

					if(isUpdated){
						res.json({
							status:'success',
							message:'New User Added'
						})
					}else{
						if(req.filename){
							this.clearFile(req.filename);
						}
						res.status(500).json({
							status: 'failure',
							message: 'Something went wrong'
						});
					}

				}else if(isExistUser.length == 0){
					if(req.filename){
						this.clearFile(req.filename);
					}
					res.status(404).json({
						status: 'failure',
						message: 'No such user found'
					});
				}else{
					if(req.filename){
						this.clearFile(req.filename);
					}
					res.status(400).json({
						status: 'failure',
						message: 'Experties or Experties Level is not correct'
					});
				}
			}catch(err){
				if(req.filename){
					this.clearFile(req.filename)
				}
				res.status(500).json({
					status: 'failure',
					message: 'Something went wrong',
					'error': err.message
				});
			}
		}else{
			if(req.filename){
				this.clearFile(req.filename)
			}
			res.status(400).json({
				status: 'failure',
				message: 'Please fill require fields'
			});
		}
	}

	async deleteUser(req,res){
		let user_id = req.params.user_id;
		try{

			let isExistUser = await super.queryDb('SELECT user_email_id FROM user_details WHERE user_id = ?', [user_id]);

			if(isExistUser.length){

				let isDeleted = await super.queryDb('UPDATE user_details SET user_is_active = 0 WHERE user_id = ?',[user_id]);

				if(isDeleted){
					res.json({
						status: 'success',
						message: 'User is deleted'
					});
				}else{
					res.json({
						status: 'failure',
						message: 'Somethings went wrong'
					});
				}

			}else{
				res.status(404).json({
					status: 'failure',
					message: 'No such user found'
				});
			}
			
		}catch(err){
			res.status(500).json({
				status: 'failure',
				message: 'Something went wrong',
				'error': err.message
			});
		}
		
	}

}