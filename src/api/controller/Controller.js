import express from 'express';
const config = require('../db.config');
const mysql = require('mysql');
import _ from 'lodash';
import moment from 'moment-timezone';

export default class Controller{
	// static dbController
	constructor(){
		Controller.dbConnection = mysql.createPool(config);
		// console.log(Controller)
	}

	queryDb(query,options){
		let self = this; 
		return new Promise((resolve,reject)=>{
			if(options){
				Controller.dbConnection.query(query,options,(err,result)=>{
					if(err) reject(err);
					else resolve(result);
				});
			}else{
				Controller.dbConnection.query(query,(err,result)=>{
					if(err) reject(err);
					else {
						resolve(result)
						// Controller.dbConnection.release();					
					};
				});
			}
		});
	}

}