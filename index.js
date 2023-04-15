'use strict';
const express = require('express')
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const app = express();
app.use(cors());
const PORT = process.env.PORT;
const apikey=process.env.API_KEY

//create your .env file


//http://localhost:3006/TestRout (you can delete the test rout after you make sure every thing is ok)
app.get('/TestRout', TestRoutHandler);

//Routs
app.get("/recipes", recipesHandler);







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
        console.log(`${error}`);
    })

}


//constructor
function Recipe(title,time,image){
    this.title=title;
    this.time=time;
    this.image=image;
}


//let it be at the end of your file
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})