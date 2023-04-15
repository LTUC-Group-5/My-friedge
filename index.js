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




app.post('/addIngredient', addNewIngredientHandler);
app.get ('/allIngredient', allIngredientHandler)
app.put('/updateIngredient/:id',updateHandler)








app.use("*", handleNtFoundError)// make sure to always make it the last route 





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
