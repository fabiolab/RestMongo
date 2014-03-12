RestMongo
=========

RestMongo is a generic nodejs WS that makes Mongo Data available from a REST API.

It's similar to RestES (http://github.com/pagesjaunes/RestES) for Mongo, but includes much more industrial stuff, as smoke tests, logs, ... and get benefits from a better code structuration.

Development repo is here: http://github.com/pagesjaunes/RestMongo

Description
====

RestMongo aims to add a Rest API layer on a MongoDB collection. This is built to make this layer as flexible and easy to configure as possible.
With RestES you have only to declare a route and a matching elasticsearch query in the "routes.json" file.

Example of routes.json file, addressing a collection of "Rubriques" (Activities)
```javascript
{
"name":"List rubriques",
"description":"Get a list of all rubriques",
"path":"/rubriques",
"mongoQuery":{
    "method":"find",
    "query":{
        "criteria":{
            
        },
        "projection":{
            "_id":0
        }
    }
}
},
{
"name":"Rubrique by code",
"description":"Get a rubrique by its an9 code",
"path":"/rubrique/:an9",
"mongoQuery":{
    "method":"findOne",
    "query":{
        "criteria":{
            "code_AN9":"@an9@"
        },
        "projection":{
            "_id":0
        }
    }
}
}
```

This makes the following url available :
* http://localhost/rubriques : returns a list of activities
* http://localhost/rubrique/45120 : returns the activity whom id matches to 45120


Installation
====
* Get the code from the github repo : http://github.com/pagesjaunes/RestMongo
* Edit the files :
  * conf/conf.json (port : the app will listen on the set value)
  * conf/log_conf.json (conf for the logger)
  * conf/routes.conf (each object of the json array contains a map between a "route" and a "query". Add your routes (parameters must begins with the ":" caracter), and the matching mongo query (route parameters can be used in the query : they have to be boxed with two "@" caracter))

Run
====
* Launch the app with node (for instance : > node app.js)
 
