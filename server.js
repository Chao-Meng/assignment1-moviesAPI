/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: __Chao Meng_____ Student ID: _128438215_ Date: __2022-09-15____
*  Cyclic Link: 
*
********************************************************************************/ 


const express=require("express");
//const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors=require("cors");
//require dotenv package to enable read code from .env file
require('dotenv').config();
//const {MONGODB_CONN_STRING} = process.env;
app.use(bodyParser.json());
//declared to use cors
app.use(cors());
//parse the json in the request body
app.use(express.json());

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
const HTTP_PORT = process.env.PORT || 8080;
//const myUdatedConnectionString = MoviesDB("mongodb+srv://cmeng14:dE355PKsXXSAkwv@cluster0.wjwfi.mongodb.net/sample_mflix?retryWrites=true&w=majority");
//MONGODB_CONN_STRING=myUdatedConnectionString;
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

//Add routs
//GET/api/movies. must accept the numeric query parameters "page" and "perPage" 
app.get("/api/movies",(req,res)=>{
    db.getAllMovies(req.query.page,req.query.perPage,req.query.title).then((msg)=>{
        console.log(msg);
        if(msg.length===0){
            res.status(204).json({message:"no data"});
        }else{
            res.status(200).json(msg);
        }  
    }).catch(err=>{
        res.status(400).json({message:err+" or please input your query detail, page , prePage and others"});
    });
});


//POST /api/movies
app.post("/api/movies",(req,res)=>{
    //call addNewMovie()
    db.addNewMovie(req.body).then((addMovie)=>{
        console.log(addMovie);
        res.status(201).json(addMovie);
    }).catch(err=>{
        res.status(400).json({message:err});
    });
});
//GET/api/movies
app.get("/api/movies/:id",(req,res)=>{
    console.log(req.params.id);
    db.getMovieById(req.params.id).then(movie=>{
        res.status(200).json(movie)
    }).catch(err=>{
        res.status(400).json({message:err + "please input the right query id info"});
    });
});

//PUT/api/movie
app.put("/api/movies:id",(req,res)=>{
    myUdatedConnectionString.getMovieById(req.params.id).then((addMovie)=>{
        if(addMovie!=null){
            db.updateMovieById(req.body,req.params.id).then((msg)=>{
                res.status(200).json(msg);
            }).catch(err=>{
                res.status(404).json({message:err});
            });
        }
    }).catch(err=>{
        res.json({message:err});
    });
});

//DETELE/api/movies
app.delete("api/movies/:id",(req,res)=>{
    db.deleteMovieById(req.params.id).then((msg)=>{
        res.status(200).json(msg);
    }).catch(err=>{
        console.log(err);
    res.status(404).json({message:err});
    });
})

//single GET route "/" is required which returns the following object (JSON): {message: "API Listening"}
app.get('/',(req,res)=>{
    res.json({message:"API Listening"});
});

