
import express from 'express';
import moment from 'moment-timezone';
import User from '../controller/Users';
import autheticate from '../authenticate.js'
import fs from 'fs';

const multer = require('multer');


let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (!fs.existsSync('uploads')){			
			fs.mkdirSync('uploads');
		}
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
		console.log('file name is ',req.body);
		if(req.body && (req.body.first_name != '' && req.body.last_name != '')){
			let user_name = req.body.first_name +' '+req.body.last_name;
			user_name = user_name.toLowerCase().replace(/\s/g,'_');
			let filename = file.originalname.split('.');
			req.filename = user_name+ '-' + Date.now()+'.'+filename[filename.length - 1];
			cb(null, req.filename);
		}else{
			cb(null,'');
		}
	}
})


export default class UserRouter{
	constructor(){
		this.router = express.Router();
		this.user = new User();
		this.upload = multer({ storage: storage });
		this.routes();
	}

	routes(){
		let self = this;

		/**
		 * @api {get} users/list 01. Get list of all the users
		 * @apiVersion 1.0.0
		 * @apiName getUserList
		 * @apiGroup Users
		 * 
		 * @apiSuccess {Object[]} users List of all the users.
		 * @apiSuccess {Number} users.id Id of the user.
		 * @apiSuccess {String} user.dp Link for Display Pic of the user
		 * @apiSuccess {String} user.fist_name First Name of the user
		 * @apiSuccess {String} user.last_name of Last Name the user
		 * @apiSuccess {String} user.email_id Email Id of the user
		 * @apiSuccess {Number} user.phone_no Phone No of the user
		 * @apiSuccess {String} user.experties Experties of the user
		 * @apiSuccess {String} user.level_of_experties Level of experience of the user
		 * @apiSuccess {Number} user.years_of_experience Years of Experience of the user
		 * @apiSuccess {Object[]} experties List of all the Experties
		 * @apiSuccess {Number} experties.id Id of the experties
		 * @apiSuccess {String} experties.name Name of the Experties
		 * @apiSuccess {Object[]} experties_level List of all the Experties Level
		 * @apiSuccess {Number} experties_level.id Id of the Experties Level
		 * @apiSuccess {String} experties_level.name Name of the Experties Level
		 * @apiSuccess {String} status It contains the status of the API query. Options are <code>success</code> or <code>failure</code>
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 * 		{
		 *          "users":[
		 *              {
		 *                  "id": 1,
		 *                  "dp": "suman_paul_1539260889.jpg",
		 *                  "first_name": "Suman",
		 *                  "last_name": "Paul",
		 *                  "email": "smnkumarpaul@gmail.com",
		 *                  "phone_no": 983042080,
		 *                  "experties": "Node Js",
		 *                  "level_of_experties":"intermidiate",
		 *                  "years_of_exp": 1
		 *              },
		 *              ...
		 *          ],
		 *          "experties":[
		 *              {
		 *                  "id": 1,
		 *                  "name": "Node Js"
		 *              },
		 *              {
		 *                  "id": 2,
		 *                  "name": "Angular Js"
		 *              },
		 *              {
		 *                  "id": 3,
		 *                  "name": "React Js"
		 *              },
		 *              {
		 *                  "id": 4,
		 *                  "name": "Vue Js"
		 *              }
		 *              
		 *          ],
		 *          "experties_level":[
		 *              {
		 *                  "id": 1,
		 *                  "name": "Beginner"
		 *              },
		 *              {
		 *                  "id": 2,
		 *                  "name": "Intermediate"
		 *              },
		 *              {
		 *                  "id": 3,
		 *                  "name": "Senior"
		 *              },
		 *              {
		 *                  "id": 4,
		 *                  "name": "Expert"
		 *              }
		 *          ],
		 *          "status":"success"
		 *          }
		 * 
		 * @apiError 401 If user is not autheticated.  
		 * @apiErrorExample Error 401 Response 
		 *     HTTP/1.1 401 Unauthorized
		 *     {
		 *		"status": "failure"
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

		this.router.get('/list',autheticate,(req,res)=>{
			self.user.getUserList(req,res);
		});

		/**
		 * @api {post} users/new 02. Add new users
		 * @apiVersion 1.0.0
		 * @apiName addNewUser
		 * @apiGroup Users
		 * 
		 * @apiParam {Binary} dp Display Pic for the User
		 * @apiParam {String} fist_name First Name of the user
		 * @apiParam {String} last_name of Last Name the user
		 * @apiParam {String} company_name of Name of the company of user
		 * @apiParam {String} email_id Email Id of the user
		 * @apiParam {Number} phone_no Phone No of the user
		 * @apiParam {Number} experties Id of the Experties user have
		 * @apiParam {Number} level_of_experties Id of the experties level user have
		 * @apiParam {Number} years_of_experience Years of Experience of the user
		 *
		 * @apiSuccess {String} message It contains message from the API query.
		 * @apiSuccess {String} status It contains the status of the API query. Options are <code>success</code> or <code>failure</code>
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 * 		{
		 *          "message":"New User added",
		 *          "status":"success"
		 *      }
		 *
		 * @apiError 400 If request object is not filled.  
		 * @apiErrorExample Error 400 Response 
		 *     HTTP/1.1 400 Bad Request
		 *     {
		 *		"message": "Please fill the required fields"
		 *		"status": "failure"
		 *     }
		 * 
		 * @apiError 401 If user is not autheticated.  
		 * @apiErrorExample Error 401 Response 
		 *     HTTP/1.1 401 Unauthorized
		 *     {
		 *		"status": "failure"
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

		this.router.post('/new',autheticate,self.upload.single('dp'),(req,res)=>{
			self.user.addNewUser(req,res);
		});

		/**
		 * @api {post} users/:user_id/edit 03. Edit Existing Users
		 * @apiVersion 1.0.0
		 * @apiName editUserDetails
		 * @apiGroup Users
		 * 
		 * @apiParam {Number} user_id Id of the User
		 * @apiParam {Binary} dp Display Pic for the User
		 * @apiParam {String} fist_name First Name of the user
		 * @apiParam {String} last_name of Last Name the user
		 * @apiParam {String} email_id Email Id of the user
		 * @apiParam {Number} phone_no Phone No of the user
		 * @apiParam {Number} experties Id of the Experties user have
		 * @apiParam {Number} level_of_experties Id of the experties level user have
		 * @apiParam {Number} years_of_experience Years of Experience of the user
		 *
		 * @apiSuccess {String} message It contains message from the API query.
		 * @apiSuccess {String} status It contains the status of the API query. Options are <code>success</code> or <code>failure</code>
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 * 		{
		 *          "message":"User detyail edited",
		 *          "status":"success"
		 *      }
		 *
		 * @apiError 400 If request object is not filled.  
		 * @apiErrorExample Error 400 Response 
		 *     HTTP/1.1 400 Bad Request
		 *     {
		 *		"message": "Please fill the required fields"
		 *		"status": "failure"
		 *     }
		 * 
		 * @apiError 404 If <code>user_id</code> does not exists in the database.  
		 * @apiErrorExample Error 404 Response 
		 *     HTTP/1.1 404 Bad Request
		 *     {
		 *		"message": "No such user found"
		 *		"status": "failure"
		 *     }
		 * 
		 * @apiError 401 If user is not autheticated.  
		 * @apiErrorExample Error 401 Response 
		 *     HTTP/1.1 401 Unauthorized
		 *     {
		 *		"status": "failure"
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

		this.router.post('/:user_id/edit',autheticate,self.upload.single('dp'),(req,res)=>{
			self.user.editUserDetails(req,res);
		});

		/**
		 * @api {delete} users/:user_id/delete 04. Delete existing Users
		 * @apiVersion 1.0.0
		 * @apiName deleteUser
		 * @apiGroup Users
		 * 
		 * @apiParam {Number} user_id Id of the User
		 *
		 * @apiSuccess {String} message It contains message from the API query.
		 * @apiSuccess {String} status It contains the status of the API query. Options are <code>success</code> or <code>failure</code>
		 *
		 * @apiSuccessExample Success-Response:
		 *     HTTP/1.1 200 OK
		 * 		{
		 *          "message":"User deleted",
		 *          "status":"success"
		 *      }
		 *
		 * @apiError 400 If user_id is not provided.  
		 * @apiErrorExample Error 400 Response 
		 *     HTTP/1.1 400 Bad Request
		 *     {
		 *		    "message": "Please provide theuser id"
		 *		    "status": "failure"
		 *     }
		 * 
		 * @apiError 404 If <code>user_id</code> does not exists in the database.  
		 * @apiErrorExample Error 404 Response 
		 *     HTTP/1.1 404 Bad Request
		 *     {
		 *		"message": "No such user found"
		 *		"status": "failure"
		 *     }
		 * 
		 * @apiError 401 If user is not autheticated.  
		 * @apiErrorExample Error 401 Response 
		 *     HTTP/1.1 401 Unauthorized
		 *     {
		 *		"status": "failure"
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
		
		this.router.delete('/:user_id/delete',autheticate,(req,res)=>{
			self.user.deleteUser(req,res);
		});

	}

}