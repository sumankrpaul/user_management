let config = require('./db.config');
const mysql = require('mysql');

let authenticate = function(req,res,next){

    let sessid = req.headers['auth-token'];
    console.log('req.headers > ', req.headers);
    console.log('sessid > ', sessid);
    
    if(sessid && sessid!= ''){
        let connection = mysql.createConnection(config);
        connection.query('SELECT * FROM user_session WHERE session_id = ?',[sessid],function(err,result){
            if(result.length && result[0].session_logout_time == null){
                req.user_id = result[0].user_id;
                next();
            }else{
                res.status(401).json({
                    status:'failure',
                    message:'You are not authenticated'
                })
            }
        })
    }else{
        res.status(401).json({
            status:'failure',
            message:'You are not authenticated'
        })
    }
}

module.exports = authenticate;