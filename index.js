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

//---SQL Routes---

//GET Routes
app.get("/recipes", recipesHandler); //(you can delete the test rout after you make sure every thing is ok)
app.get("/getAllRecipes", getAllRecipesHandler)
app.get ('/allIngredient', allIngredientHandler)

//POST Routs
app.post("/addNewRecipe", addNewRecipesHandler)
app.post('/addIngredient', addNewIngredientHandler);

//PUT Routs
app.put('/updateIngredient/:id',updateHandler)


//---API Routes---

//GET Routes
app.get("/complexSearch", complexSearchHandler);
app.get("/findByIngredients", findByIngredientsHandler);

//Error Handler Routes
app.use("*", handleNtFoundError)// make sure to always make it the last route 

//---SQL Functions---

//GET Functions
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

    function allIngredientHandler(req, res) {
    let { userID } = req.body;
    let query= `SELECT * from favorite_ingredient where userID=${userID}`;

    client.query(query).then((result)=> {
        console.log(result);
         res.json(result.rows);
    }).catch(
       
    );
}

//POST Functions
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

function addNewIngredientHandler(req, res) {
    console.log(req.body);

    let {item_name,item_image,quantity,id} = req.body;

    let sql =`INSERT INTO "favorite_ingredient"(item_name,item_image,quantity,id) VALUES($1,$2,$3,$4) RETURNING *`;
    let values = [item_name,item_image,quantity,id];
    client.query(sql, values).then((result)=> {
        console.log(result);
        res.status(201).json(result.rows);
    }).catch();

}

//PUT Functions
function updateHandler(req,res){
    let {quantity,id,userID} = req.body;

    let sql =`UPDATE favorite_ingredient SET quantity=$1  WHERE id=$2 and userID=$3 RETURNING *`;
    let values = [quantity,id,userID];
    
    client.query(sql,values).then(result=>{
        console.log(result.rows);
        res.send(result.rows)
    }).catch()}


//---API Functions---

//GET Functions

function findByIngredientsHandler(req,res) {

// req.body = [{"items": ["cheese", "flour", "tomato"], "number": 3}];
    let url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${formatDataToPattern(req.body)}&apiKey=${apikey}`;
    
    axios.get(url)
    .then((result)=>{   
        res.json(result.data);
    })    
    .catch((err)=>{
        console.log(err);
    }) 
    
    // send Parameters in body as JSON format    
function complexSearchHandler(req,res) {
    let url =`https://api.spoonacular.com/recipes/complexSearch?${objectToQueryParams(req.body)}&apiKey=${apikey}`

    axios.get(url)
    .then((result)=>{
        console.log(result.data.results);

        let dataRecipes = result.data.results.map((recipe)=>{
            return new Recipe(recipe.id,recipe.title,recipe.image)
        })    
        res.json(dataRecipes);
    })    
    .catch((err)=>{
        console.log(err);
    })    
} 

//Error Handler
function serverErrorHadnler(req, res, err = "Sorry, something went wrong") {
    res.status(500).send({
        "status": 500,
        "response": err
    });
    console.log(err);
}

function handleNtFoundError(req, res){ 
    res.status(404).send("Rout not found") 
}    

//constructor
function Recipe(title, time, image) {
            this.title = title;
            this.time = time;
            this.image = image;
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
    


client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    })
        }).catch((err) => {
            console.log(err)
        })
