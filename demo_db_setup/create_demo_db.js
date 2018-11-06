var mysql = require('mysql');
var fs = require('fs');
var readline = require('readline');
var moment  = require('moment-timezone');
var db_config = require('./db.config');
var config_json = {
	ncr_technologies:'./demo_db_setup/ncr_technoligies.sql'
};
var no_of_db=(Object.keys(config_json).length - 1);

var importDb = function (database,file_link){
	console.log(database,file_link);
	db_config.database = database;
	var con = mysql.createConnection(config_json),query='';

	var rl = readline.createInterface({
		input: fs.createReadStream(file_link),
		terminal: false
	});

	rl.on('line', function(chunk){
		query += chunk.toString('ascii');
		if( ! /\/\*|\*\//.exec(query)){
			if(/;/.exec(query)){
				// console.log(query);
				con.query(query, function(err, sets, fields){
					if(err) console.log(err);
				});
				query = '';
			}
		}else{
			query = '';
		}
	});

	rl.on('close', function(){
		con.end();
	});

	con.on('end',function(){
		if(no_of_db <= 0){
			console.log('--- DATABASE RESETED ---');
			process.exit(0);
			// dummyDataPush();	
		}else{
			no_of_db--;
		}
	});
}
var checkDropDb = function (){	
	var self = this;
	var con = mysql.createConnection(config_json);


	Object.keys(config_json).map((database)=>{
		if(fs.existsSync(config_json[database])){
			con.query('DROP DATABASE IF EXISTS '+database, function (err){
				if (err) throw err;
				con.query('CREATE DATABASE '+database,function(err){
					if (err) throw err;
					importDb(database,config_json[database]);
				});
			});
		}
	});

};

checkDropDb();