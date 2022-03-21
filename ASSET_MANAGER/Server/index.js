const jwt =require('jsonwebtoken')
const express = require("express");
const cors=require("cors");
const res = require("express/lib/response");
const bcrypt = require("bcryptjs");
const app = express();
app.use(express.json());
app.use(cors({
  origin:["http://localhost:3000"],
  methods:["GET","POST"],
  credentials:true
}));


var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); 
var session = require('express-session');
var cookieParser = require('cookie-parser');

//const DIRECTOR_DASHBOARD=require('../client/src/pages/Director_dashboard');
//import {DIRECTOR_DASHBOARD} from '../client/src/pages/Director_dashboard';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array());
app.use(cookieParser());
app.use(session({
  key:"username",
  secret: "Your secret key",
  resave:false,
  saveUninitialized:false,
  cookie:{
  expires:60*60*24
  }
  }));






const PORT = process.env.PORT || 3001;
async function insert (username ,password){
    const OracleDB = require("oracledb");
    const saltRounds = 10;


    let db;
    try{
      db = await  OracleDB.getConnection({
      user : 'vaishnavi',
      password : 'vaishnavi',
      connectString : '(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = LAPTOP-MD2OKIIT)(PORT = 1521)) (CONNECT_DATA =(SERVER = DEDICATED) (SERVICE_NAME = PDB4)))'});
      console.log("Successfully connected to database");
     
        try{ 
            db.execute("insert into user_data values (:USERNAME,:PASSWORD)",{USERNAME :`${username}`,PASSWORD: `${hash}`},{autoCommit:true});
            db.commit();
            }
        catch(err){
              console.log("Username already exists");
          }

    }catch(err){
        console.error(err);
    }finally{
            if(db){
                try{
                    await db.close(); 
                }catch(err){
                 console.error(err);
                }
           }
        }

  };

 

app.post('/register',(req,res)=>{
  console.log("vaishavi kupekar");
  const username=req.body.USERNAME;
  const password=req.body.PASSWORD;
  insert(username,password);
   });

app.post('/login',async function(req,res){
  console.log("vaishavi kupekar");
  const username=req.body.USERNAME;
  const password=req.body.PASSWORD;

  const OracleDB = require("oracledb");
  

  let db;
  try{
    db = await  OracleDB.getConnection({
    user : 'vaishnavi',
    password : 'vaishnavi',
    connectString : '(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = LAPTOP-MD2OKIIT)(PORT = 1521)) (CONNECT_DATA =(SERVER = DEDICATED) (SERVICE_NAME = PDB4)))'});
/*1*/     console.log("Successfully connected to database");
    await db.execute('select username,password from user_data where username= :1 and password= :2  ',[`${username}`,`${password}`],
                      {autoCommit:true},
                      (err,result)=>{
                                if(err){
                                 //console.log("wrong password/username combination");
                                 res.send(false);
                                        }
                                if(result.rows.length>0 ){
                                  //req.session.user=result.rows[0][0]
                                 // console.log("session:"+req.session.user);
                                  console.log("the user is");
                                  console.log(result.rows[0][1]);
                                 // const role=result.rows[0][2];
                                //  res.json({response:'true',role:`${role}`})
                               //   const obj={response:'true',role:`${role}`}
                               //  res.send(obj);
                               console.log(result.rows[0][2]);
                                  res.send(result.rows[0][1]);//lOGIN SUCCESSSFUL
                                 // res.redirect("http://localhost:3000/DIRECTOR_DASHBOARD");
                                  } else{
                                        res.send(false);
                                        //console.log("wrong password/username combination");
                                        //res.send({message:"wrong username/password combination"});
                                        }
                                       }
                      );          
  }
  catch(err){
      console.error(err);
  }
  finally{
          if(db){
              try{
                  await db.close(); 
              }catch(err){
               console.error(err);
              }
         }
      }
  });



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});