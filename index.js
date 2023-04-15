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
app.get("/ingredients/autocomplete", ingredientsAutocomplete );
app.delete('/deleteRecipes', deleteRecipes)
app.delete('/deleteIngredient', deleteIngredient)





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
function ingredientsAutocomplete(req, res){
     let ingredientsName = "appl"
    let url = `https://api.spoonacular.com/food/ingredients/autocomplete?query=${ingredientsName}&apiKey=${apikey}`;
    axios.get(url)
    .then((result)=>{
        
console.log(result)
        res.json(result.data); 
    })

    .catch((err)=>{
        console.log(err);
    })

}


function deleteRecipes(req,res){
    let {id} = req.body; 
    let { userID } = req.body;
    let sql=`DELETE FROM favorite_recipe WHERE id = $1 AND userID = $2 RETURNING *;`;
    let value = [id,userID];
    client.query(sql,value).then(result=>{
         res.status(204).send("deleted");
        res.json(result.rows)
    }).catch()
}

function deleteIngredient(req,res){
    let {id} = req.body; 
    let { userID } = req.body;
    let sql=`DELETE FROM favorite_ingredient WHERE id = $1 AND userID = $2 RETURNING *;`;
    let value = [id,userID];
    client.query(sql,value).then(result=>{
        res.status(204).send("deleted");
        res.json(result.rows)
    }).catch()
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