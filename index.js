
'use strict';

const express = require('express');
var cors = require('cors');
const axios = require('axios');
const { request } = require('express');
require('dotenv').config();
const { Client } = require('pg');
const app = express();
const bodyParser = require('body-parser');
const qureyString = require("querystring");

//environment variables
// IMPORTANT! create your .env file
const PORT = process.env.PORT;
const apikey = process.env.API_KEY;
const dataBaseUrl = process.env.DATABASE_URL;
const ingredients_table = process.env.INGREDIENT_TABLE;
const recipes_table = process.env.RECIPE_TABLE;

const client = new Client(process.env.DATABASE_URL);
//app useages
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())




//GET Routs

app.get("/AllRecipes", getAllRecipesHandler);

app.get('/RecipeAnalyzedInstructions', analyzedInstructionsHandler);

app.get('/AutoComplete', autoCompleteHandler);


//POST Routs

app.post("/NewRecipe", addNewRecipesHandler);

app.post("/addNewRecipe", addNewRecipesHandler);




//general functions

function notFoundErrorHandler(req, res) {
    res.status(404).send("Route not found")
}

function serverErrorHadnler(req, res, error = "Sorry, something went wrong") {
    res.status(500).send({
        "status": 500,
        "response": error
    });
    console.log(error);
}

//API Handlers

function analyzedInstructionsHandler(req, res) {

    let url = `https://api.spoonacular.com/recipes/${qureyString.stringify(req.body)}/analyzedInstructions?apiKey=${apikey}`;
    axios.get(url)
        .then((result) => {
            console.log(result.data);
            let response = result.data;
            res.json(response);
        })
        .catch((error) => {
            serverErrorHadnler(req, res, error);
        })
}

function autoCompleteHandler(req, res) {

    let url = `https://api.spoonacular.com/food/ingredients/autocomplete?${qureyString.stringify(req.body)}&apiKey=${apikey}`
    axios.get(url)
        .then((result) => {
            console.log(result.data);
            let response = result.data;
            res.json(response);
        })
        .catch((err) => {
            console.log(err)
        })
}

function addNewRecipesHandler(req, res) {
    let { id, title, item_image, userID } = req.body;
    let values = [id, title, item_image, userID];
    let query = `INSERT INTO ${recipes_table} (id, title, item_image,userID)
        VALUES ($1,$2,$3,$4) returning *`;
    client.query(query, values, (error, sqlResult) => {
        if (error) {
            serverErrorHadnler(req, res, error);
        }
        else
            res.json(sqlResult.rows);
    })
}


//SQL Handlers

function getAllRecipesHandler(req, res) {

    let { userID } = req.body;
    let values = [userID];
    let query = `select * from ${recipes_table} where userID=$1`;
    client.query(query, values, (error, sqlResult) => {
        if (error) {
            serverErrorHadnler(req, res, error);
        }
        else
            res.json(sqlResult.rows);
    })
}

function addNewRecipesHandler(req, res) {

    let { id, title, item_image, userID } = req.body;
    let values = [id, title, item_image, userID];
    let query = `INSERT INTO ${recipes_table} (id, title, item_image,userID)
        VALUES ($1,$2,$3,$4) returning *`;
    client.query(query, values, (error, sqlResult) => {
        if (error) {
            serverErrorHadnler(req, res, error);
        }
        else
            res.json(sqlResult.rows);
    })
}

//server start section

client.connect().then(() => {

    app.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    })

}).catch((error) => {

    console.log(error);
})
