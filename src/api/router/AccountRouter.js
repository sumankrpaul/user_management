
import express from 'express';
import moment from 'moment-timezone';
import Accounts from '../controller/Accounts';



export default class AccountsRouter{
	constructor(){
		this.router = express.Router();
		this.routes();
		this.accouts = new Accounts();
	}

	routes(){
		let self = this;

		/**
		 * @api {post} accounts/login 01. Login to the account
		 * @apiVersion 1.0.0
		 * @apiName accountLogin
		 * @apiGroup Accounts
		 * 
		 * @apiParam {String} email_id Email ID of the user.
		 * @apiParam {String} password Password of the user.
		 * 
		 * @apiSuccess {String} status It contains the status of the API query. Options are <code>success</code> or <code>failure</code>
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 * 		{
		 * 			status:'success'
		 * 		}
		 * 
		 * @apiError 400 If email_id or password not provided. 
		 * @apiErrorExample Error 400 Response 
		 *     HTTP/1.1 400 Bad Request
		 *     {
		 *		"status": "failure"
		 *		"message": "Please provide your email_id and password"
		 *     } 
		 * 
		 * @apiError 404 If email_id does not exist. 
		 * @apiErrorExample Error 404 Response 
		 *     HTTP/1.1 404 Not Found
		 *     {
		 *		"status": "failure"
		 *		"message": "No such email Id exists"
		 *     }
		 * 
		 * @apiError 401 If email_id and password dosen't match.  
		 * @apiErrorExample Error 401 Response 
		 *     HTTP/1.1 401 Unauthorized
		 *     {
		 *		"status": "failure"
		 *		"message": "Email ID or Password is wrong"
		 *     }
		 * 
		 * @apiError 500 If failure occurs in case of the server 
		 * @apiErrorExample Error 500 Response 
		 *     HTTP/1.1 500 Internal Server Error
		 *     {
		 *			"status": "failure"
		 *			"message": "Something went wrong"
		 *			"error":"error message"
		 *     }
		 * 
		 */

		this.router.post('/login',(req,res)=>{
			self.accouts.accountLogin(req,res);
		});


	}
}