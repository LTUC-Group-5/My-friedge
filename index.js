'use strict';
const express = require('express');
var cors = require('cors');
const axios = require('axios');
const { request } = require('express');
require('dotenv').config();
const { Client } = require('pg');
const app = express();
const bodyParser = require('body-parser')
//environment variables
const PORT = process.env.PORT;
const apikey = process.env.API_KEY;
const dataBaseUrl = process.env.DATABASE_URL;
const ingredients_table = process.env.INGREDIENT_TABLE;
const recipes_table = process.env.RECIPE_TABLE;

const client = new Client(process.env.DATABASE_URL)
//app useages
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


//create your .env file





//GET Routs
app.get("/recipes", recipesHandler); //(you can delete the test rout after you make sure every thing is ok)

app.get("/getAllRecipes", getAllRecipesHandler)

//POST Routs

app.post("/addNewRecipe", addNewRecipesHandler)






app.get('/a', analyzedInstructions);
app.get('/autocomplete', autoComplete);
app.use("*", handleNtFoundError)// make sure to always make it the last route 





//Functions
function TestRoutHandler(req, res) {   //(you can delete the TestRoutHandler function  after you make sure every thing is ok)
    res.send("The server is alive")
}

function handleNtFoundError(req, res) {
    res.status(404).send("Route not found")
}

function serverErrorHadnler(req, res, err = "Sorry, something went wrong") {
    res.status(500).send({
        "status": 500,
        "response": err
    });
    console.log(err);
}

function recipesHandler(req, res) {

    let url = `https://api.spoonacular.com/recipes/random?apiKey=${apikey}`;
    axios.get(url)
        .then((result) => {
            console.log(result.data.recipes);

            let dataRecipes = result.data.recipes.map((recipe) => {
                return new Recipe(recipe.title, recipe.readyInMinutes, recipe.image)
            })

            res.json(dataRecipes);
        })
        .catch((err) => {
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

function getAllRecipesHandler(req, res) {
    let { userID } = req.body;
    let query = `select * from ${recipes_table} where userID=${userID}`;
    client.query(query)
        .then((queryRes) => {
            res.json(queryRes.rows)
        })
        .catch((err) => {
            serverErrorHadnler(req, res, err);
        })
}

function addNewRecipesHandler(req, res) {
    let { id, title, item_image, userID } = req.body;
    let values = [id, title, item_image, userID];
    let query = `INSERT INTO ${recipes_table} (id, title, item_image,userID)
        VALUES ($1,$2,$3,$4) returning *`;
    client.query(query, values, (error, sqlResult) => {
        if (error) {
            serverErrorHadnler(req,res,error);
        }
        else
        res.json(sqlResult.rows);
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
function Recipe(title, time, image) {
            this.title = title;
            this.time = time;
            this.image = image;
        }


client.connect().then(() => {

            app.listen(PORT, () => {
                console.log(`Server is listening ${PORT}`);
            })

        }).catch((err) => {

            console.log(err)
        })
