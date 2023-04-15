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

//Routs

app.get("/complexSearch", complexSearchHandler);
app.get("/findByIngredients", findByIngredientsHandler);
app.post('/addIngredient', addNewIngredientHandler);
app.get ('/allIngredient', allIngredientHandler)
app.put('/updateIngredient/:id',updateHandler)

app.use("*", handleNtFoundError)// make sure to always make it the last route 

//Functions

function handleNtFoundError(req, res){ 
    res.status(404).send("Rout not found") 
}    

function formatDataToPattern(data) {
    const items = data[0].items.map((item, index) => {
      return index === 0 ? item : `+${item}`;
    }).join(",");
    const number = data[0].number;
    return `${items}&number=${number}`;
  }

function findByIngredientsHandler(req,res) {
req.body = [{"items": ["cheese", "flour", "tomato"], "number": 3}]

    let url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${formatDataToPattern(req.body)}&apiKey=${apikey}`;
    
    axios.get(url)
    .then((result)=>{

        // let dataRecipes = result.data.results.map((recipe)=>{
        //     return new Recipe(recipe.id,recipe.title,recipe.image)
        // })    
        res.json(result.data);
    })    
    .catch((err)=>{
        console.log(err);
    })    

//Functions
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

function allIngredientHandler(req, res) {
    let { userID } = req.body;
    let query= `SELECT * from favorite_ingredient where userID=${userID}`;

    client.query(query).then((result)=> {
        console.log(result);
         res.json(result.rows);
    }).catch(
       
    );
}

function updateHandler(req,res){
    let {quantity,id,userID} = req.body;

    let sql =`UPDATE favorite_ingredient SET quantity=$1  WHERE id=$2 and userID=$3 RETURNING *`;
    let values = [quantity,id,userID];
    
    client.query(sql,values).then(result=>{
        console.log(result.rows);
        res.send(result.rows)
    }).catch()}

function handleNtFoundError(req, res){ 
    res.status(404).send("Rout not found") 
}
 }   
 
  function objectToQueryParams(obj) {
      const params = Object.keys(obj)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
        .join('&');
      return params;  
    }  
    
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
//constructor

function Recipe(id,title,image){
    this.id=id;
    this.title=title;
    this.image=image;
}

client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    })
    
}).catch((err)=>{

console.log(err)})
