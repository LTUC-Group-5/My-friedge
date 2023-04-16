# Software Requirements
## Vision
### What is the vision of this product?

We are living in a time in which the person must be practical, our product will help the user to make fast decisions regarding cooking and managing his/her food inventory

### What pain point does this project solve?

It solves the confusion of “What will I eat now?”
If you are hungry just use the web app and with one click you can see all the suggestions of food recipes that you can do with your current inventory 

### Why should we care about your product?

You should care about our product because, it is a unique product that will help you to save time thinking about food making and inventory management, not only will it help you to eat healthier but also if you are a food lover our product will help you discover new dishes that you can cook with your current pantry.



### Scope (In/Out)

### IN - What will your product do

### Describe the individual features that your product will do.

1- You can get a recipe suggestion based on specific ingredients from your pantry

2- The web app will encourage you to cook healthy options and give you a step-by-step guide  

3- You can search for a specific recipe or dish.

4- Managing the inventory by performing add, delete, and update operations on your ingredients and recipes 

### OUT - What will your product not do?

1- Our  web app will not ask for any payment to let you use our services 

2- Our project will never be a close source project

## Minimum Viable Product
### What will your MVP functionality be?

1- Get a recipe suggestion based on specified ingredients

2- Display a step-by-step guide for cooking recipes  

3- Search for a specific recipe or dish

4- Performing CRUD operations on the inventory 

### What are your stretch goals?
Add a sign-in feature for multiple users

## Stretch
### What stretch goals are you going to aim for?
Using fuzzy search on our search page

## Functional Requirements
### List the functionality of your product. This will consist of tasks such as the following:

1- The User can save a favorite list of recipes. 

2- The user can modify their inventory

3- A user can search for recipes and ingredients

## Data Flow
1- User begins using the app by logging in or creating an account.

2- Once logged in, the user can manage their inventory by adding, deleting, or updating ingredients and recipes. These updates are stored in a database.

3- When the user is ready to get a recipe suggestion based on specific ingredients, they will click on the "Get Recipe" button.

4- The app will then send a request to a backend server, which will process the request and query the API to retrieve recipes that match the specified ingredients.

5- The server will then send the list of recipe suggestions back to the app, which will display them to the user.

6- If the user wants to search for a specific recipe or dish, they can use the search feature.

7- The app will send a request to the backend server, which will search the database for recipes that match the user's search criteria.

8- The server will then send the list of search results back to the app, which will display them to the user.

9- When the user selects a recipe, the app will display a step-by-step guide on how to cook the recipe.

## Non-Functional Requirements

### Usability:
our application is easy to use and intuitive, with a clear and consistent user interface that helps users accomplish their tasks efficiently and effectively. Users should be able to easily manage their inventory and find recipe suggestions or search for specific recipes easily.

### Maintainability:
Our application should be maintainable, with a well-structured, documented, and easy-to-understand codebase. 
This may involve following coding standards and best practices, using version control systems, and providing comprehensive documentation 
