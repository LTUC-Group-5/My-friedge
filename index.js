'use strict';
const express = require('express')
var cors = require('cors');
const axios = require('axios');
const { request } = require('express');
require('dotenv').config();
const { Client } = require('pg')
const app = express();
app.use(cors());
const bodyParser = require('body-parser')
const PORT = process.env.PORT;
const apikey=process.env.API_KEY
const dataBaseUrl=process.env.DATABASE_URL 
const client = new Client(process.env.DATABASE_URL)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//postgres://username:sudo password@localhost:5432/database name
//postgres://ibraheem:0000@localhost:5432/movies

//create your .env file




//http://localhost:portnumber/TestRout (you can delete the test rout after you make sure every thing is ok)
app.get('/TestRout', TestRoutHandler);

//Routs
app.get("/recipes", recipesHandler); //(you can delete the test rout after you make sure every thing is ok)








app.get('/a', analyzedInstructions);
app.get('/autocomplete', autoComplete);
app.use("*", handleNtFoundError)// make sure to always make it the last route 





//Functions
function TestRoutHandler(req, res) {   //(you can delete the TestRoutHandler function  after you make sure every thing is ok)
    res.send("The server is alive")
}

function handleNtFoundError(req, res){ 
    res.status(404).send("Rout not found") 
}


function recipesHandler(req, res){
    
    let url = `https://api.spoonacular.com/recipes/random?apiKey=${apikey}`;
    axios.get(url)
    .then((result)=>{
        console.log(result.data.recipes);

        let dataRecipes = result.data.recipes.map((recipe)=>{
            return new Recipe(recipe.title, recipe.readyInMinutes,recipe.image)
        })
        
        res.json(dataRecipes);
    })
    .catch((err)=>{
        console.log(err);
    })

}
 

function analyzedInstructions(req,res){
    let recipeId = req.body.id 
    console.log(recipeId)
    let url=`https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=${apikey}`
    axios.get(url)
    .then((result)=>{
        console.log(result.data); 
        let response= result.data;
        res.json(response);
    })
    .catch((err)=>{
        console.log(err)
    })
}

function autoComplete(req,res){
    let {query} = req.body 
    
    let url=`https://api.spoonacular.com/food/ingredients/autocomplete?query=${query}&apiKey=${apikey}`
    axios.get(url)
    .then((result)=>{
        console.log(result.data); 
        let response= result.data;
        res.json(response);
    })
    .catch((err)=>{
        console.log(err)
    })

}


//constructor
function Recipe(title,time,image){
    this.title=title;
    this.time=time;
    this.image=image;
}







client.connect().then(() => {

    app.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    })
    
}).catch((err)=>{

console.log(err)})
