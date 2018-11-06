import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
const cors = require('cors');
import AccountRouter from './router/AccountRouter';
import UserRouter from './router/UserRouter';
import fs from 'fs';
import path from 'path';


// var whitelist = ['*', 'http://example2.com']
const requestOptions = {
	origin: function (origin , callback) {
		callback(null, true);
	  },
	methods: ['OPTIONS','GET','POST','DELETE'],
	credentials: true
  };

export default class App {

	constructor() {
		this.express = express();
		this.AccountRouter = new AccountRouter();
		this.UserRouter = new UserRouter();
		this.middleware();
		this.routes();
	}

	middleware(){
		this.express.use(morgan('dev'));
		this.express.use(bodyParser.json());
		this.express.use(cookieParser());		
		// this.express.use(bodyParser.urlencoded({extended: false}));
		this.express.use(cors(requestOptions));
	}

	

	routes(){
		this.express.use('/accounts',this.AccountRouter.router);
		this.express.use('/users',this.UserRouter.router);
		// this.express.use('/',this.UserRouter.router);
		// this.express.use('/',this.DGGroupRouter.router);
		this.express.get('/uploads/:file_name',(req,res)=>{

			let file_name = req.params.file_name;

			let file_path = path.normalize(path.join(__dirname,'../../uploads',file_name));

			console.log(file_path);

			if(fs.existsSync(file_path)){
				res.sendFile(file_path);
			}else{
				res.send('Not Found');				
			}
		});
		
	}
}