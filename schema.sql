create table favorite_ingredient(
id int PRIMARY KEY,
_name varchar(500),
_image varchar(500),
quantity int DEFAULT 1,
userID int null
);

create table favorite_recipe(
id int PRIMARY KEY,
title varchar(500),
_image varchar(500),
userID int null
);