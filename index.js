
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

const client = new Client(process.env.DATABASE_URL)
//app useages
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//---SQL Routes---

//GET Routes
app.get("/allRecipes", getAllRecipesHandler)
app.get('/allIngredients', getAllIngredientHandler)

//POST Routs
app.post("/addNewRecipe", addNewRecipesHandler)
app.post('/addIngredient', addNewIngredientHandler);

//PUT Routs
app.put('/updateIngredient/:id', updateHandler)


//---API Routes---


//GET Routes
app.get("/complexSearch", complexSearchHandler);

app.get("/findByIngredients", findByIngredientsHandler);

app.get('/recipeAnalyzedInstructions', analyzedInstructionsHandler);

app.get('/autoCompleteIngredient', autoCompleteHandler);


//---API Routes---


//Error Handler Routes
app.use("*", notFoundErrorHandler)// make sure to always make it the last route 


//---SQL Functions---


//GET Functions
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
function getAllIngredientHandler(req, res) {

    let { userID } = req.body;
    let query = `SELECT * from favorite_ingredient where userID=${userID}`;

    client.query(query, values, (error, sqlResult) => {
        if (error) {
            serverErrorHadnler(req, res, error);
        }
        else
            res.json(sqlResult.rows);
    })
}

//POST Functions
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
function addNewIngredientHandler(req, res) {
    console.log(req.body);

    let { item_name, item_image, quantity, id } = req.body;

    let sql = `INSERT INTO "favorite_ingredient"(item_name,item_image,quantity,id) VALUES($1,$2,$3,$4) RETURNING *`;
    let values = [item_name, item_image, quantity, id];
    client.query(sql, values).then((result) => {
        console.log(result);
        res.status(201).json(result.rows);
    }).catch();

}

//PUT Functions
function updateHandler(req, res) {
    let { quantity, id, userID } = req.body;
    let sql = `UPDATE favorite_ingredient SET quantity=$1  WHERE id=$2 and userID=$3 RETURNING *`;
    let values = [quantity, id, userID];

    client.query(sql, values).then(result => {
        console.log(result.rows);
        res.send(result.rows)
    }).catch()
}


//---SQL Functions---


//---API Functions---


//GET Functions
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
        .catch((error) => {
            serverErrorHadnler(req, res, error);
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
 

//Note:refactor + explain
function findByIngredientsHandler(req, res) {

    // req.body = [{"items": ["cheese", "flour", "tomato"], "number": 3}];
    let url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${formatDataToPattern(req.body)}&apiKey=${apikey}`;

    axios.get(url)
        .then((result) => {
            res.json(result.data);
        })
        .catch((err) => {
            console.log(err);
        })
}
//Note:refactor + explain
function complexSearchHandler(req, res) {
    let url = `https://api.spoonacular.com/recipes/complexSearch?${objectToQueryParams(req.body)}&apiKey=${apikey}`

    axios.get(url)
        .then((result) => {
            console.log(result.data.results);

            let dataRecipes = result.data.results.map((recipe) => {
                return new Recipe(recipe.id, recipe.title, recipe.image)
            })
            res.json(dataRecipes);
        })
        .catch((err) => {
            console.log(err);
        })
}


//---API Functions---


//Error Handlers
function serverErrorHadnler(req, res, error = "Sorry, something went wrong") {
    res.status(500).send({
        "status": 500,
        "response": error
    });
    console.log(error);
}

function notFoundErrorHandler(req, res) {
    res.status(404).send("Rout not found")
}

//Helper
function objectToQueryParams(obj) {
    const params = Object.keys(obj)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
        .join('&');
    return params;
}

function formatDataToPattern(data) {
    const items = data[0].items.map((item, index) => {
        return index === 0 ? item : `+${item}`;
    }).join(",");
    const number = data[0].number;
    return `${items}&number=${number}`;
}

//server start section

client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    })

}).catch((error) => {

    console.log(error);
})
